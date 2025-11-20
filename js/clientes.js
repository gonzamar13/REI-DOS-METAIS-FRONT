let paginaClientes = 1;
const LIMITE_CLIENTES = 5;

async function cargarClientes() {
  const contenido = document.getElementById("contenido");
  contenido.innerHTML = `
    <section class="card">
        <h3>👤 Agregar / Editar Cliente</h3>
        <form id="formCliente" style="grid-template-columns: 1fr 1fr 1fr auto;">
            <input type="hidden" id="idCliente">
            <input type="text" id="nombre" placeholder="Nombre Completo" required>
            <input type="text" id="telefono" placeholder="Teléfono" required>
            <input type="email" id="correo" placeholder="Correo Electrónico" required>
            <div style="display:flex; gap:0.5rem;">
                <button type="submit">Guardar</button>
                <button type="button" id="cancelarEdicion" class="btn-secundario">Cancelar</button>
            </div>
        </form>
    </section>

    <section class="card">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
            <h3>Listado de Clientes</h3>
            <small style="color:var(--text-light)">Página ${paginaClientes}</small>
        </div>
        <table>
            <thead>
                <tr><th>Nombre</th><th>Teléfono</th><th>Correo</th><th style="text-align:right">Acciones</th></tr>
            </thead>
            <tbody id="tablaClientes"></tbody>
        </table>
        <div class="paginacion" style="display:flex; justify-content:flex-end; gap:0.5rem; margin-top:1rem;">
            <button id="prev" class="btn-secundario">⬅ Anterior</button>
            <button id="next" class="btn-secundario">Siguiente ➡</button>
        </div>
    </section>
  `;

  async function listarClientes() {
    try {
        // Usamos la URL global
        const res = await fetch(API_URL.clientes);
        const clientes = await res.json();
        const inicio = (paginaClientes - 1) * LIMITE_CLIENTES;
        const pagina = clientes.slice(inicio, inicio + LIMITE_CLIENTES);
        
        document.getElementById("tablaClientes").innerHTML = pagina.map(c => `
          <tr>
            <td><strong>${c.nombre}</strong></td>
            <td>${c.telefono}</td>
            <td>${c.correo}</td>
            <td style="text-align:right">
              <button class="btn-editar" style="background:none; border:none; cursor:pointer;" data-id="${c.id}">✏️</button>
              <button class="btn-eliminar" style="background:none; border:none; cursor:pointer;" data-id="${c.id}">🗑️</button>
            </td>
          </tr>
        `).join("");

        asignarEventos();
    } catch (e) {
        console.error("Error listando clientes:", e);
        alert("No se pudo conectar con el servidor.");
    }
  }

  function asignarEventos() {
      document.querySelectorAll(".btn-eliminar").forEach(b => {
        b.addEventListener("click", async () => {
          if(confirm("¿Eliminar este cliente?")) {
              // Concatenamos ID directo porque API_URL.clientes ya tiene "/" al final
              await fetch(`${API_URL.clientes}${b.dataset.id}`, { method: "DELETE" });
              listarClientes();
          }
        });
      });

      document.querySelectorAll(".btn-editar").forEach(b => {
        b.addEventListener("click", async () => {
          const res = await fetch(`${API_URL.clientes}${b.dataset.id}`);
          const c = await res.json();
          document.getElementById("idCliente").value = c.id;
          document.getElementById("nombre").value = c.nombre;
          document.getElementById("telefono").value = c.telefono;
          document.getElementById("correo").value = c.correo;
        });
      });
  }

  document.getElementById("formCliente").addEventListener("submit", async e => {
    e.preventDefault();
    const id = document.getElementById("idCliente").value;
    const cliente = {
      nombre: document.getElementById("nombre").value,
      telefono: document.getElementById("telefono").value,
      correo: document.getElementById("correo").value
    };
    
    const metodo = id ? "PUT" : "POST";
    // Si hay ID, url es .../clientes/ID, si no es .../clientes/
    const url = id ? `${API_URL.clientes}${id}` : API_URL.clientes;
    
    await fetch(url, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cliente)
    });
    document.getElementById("formCliente").reset();
    document.getElementById("idCliente").value = "";
    listarClientes();
  });

  document.getElementById("cancelarEdicion").addEventListener("click", () => {
    document.getElementById("formCliente").reset();
    document.getElementById("idCliente").value = "";
  });

  document.getElementById("prev").addEventListener("click", () => {
    if (paginaClientes > 1) { paginaClientes--; listarClientes(); }
  });
  document.getElementById("next").addEventListener("click", () => {
    paginaClientes++; listarClientes();
  });

  listarClientes();
}