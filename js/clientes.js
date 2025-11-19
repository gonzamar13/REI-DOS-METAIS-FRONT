const API_URL = "/api";
let paginaClientes = 1;
const LIMITE_CLIENTES = 5;

async function cargarClientes() {
  const contenido = document.getElementById("contenido");
  contenido.innerHTML = `
    <section class="form-section">
        <h2>Agregar / Editar Cliente</h2>
        <form id="formCliente">
            <input type="hidden" id="idCliente">
            <input type="text" id="nombre" placeholder="Nombre" required>
            <input type="text" id="telefono" placeholder="Teléfono" required>
            <input type="email" id="correo" placeholder="Correo" required>
            <button type="submit">💾 Guardar</button>
            <button type="button" id="cancelarEdicion" class="btn-secundario">❌ Cancelar</button>
        </form>
    </section>

    <section class="tabla-section">
        <h2>Listado de Clientes</h2>
        <table>
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Teléfono</th>
                    <th>Correo</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody id="tablaClientes"></tbody>
        </table>
        <div class="paginacion">
            <button id="prev">⬅ Anterior</button>
            <span id="paginaActual">${paginaClientes}</span>
            <button id="next">Siguiente ➡</button>
        </div>
    </section>
  `;

  async function listarClientes() {
    const res = await fetch(`${API_URL}/clientes/`);
    const clientes = await res.json();
    const inicio = (paginaClientes - 1) * LIMITE_CLIENTES;
    const pagina = clientes.slice(inicio, inicio + LIMITE_CLIENTES);
    const tabla = document.getElementById("tablaClientes");
    tabla.innerHTML = pagina.map(c => `
      <tr>
        <td>${c.nombre}</td>
        <td>${c.telefono}</td>
        <td>${c.correo}</td>
        <td>
          <button class="btn-editar" data-id="${c.id}">✏️</button>
          <button class="btn-eliminar" data-id="${c.id}">🗑️</button>
        </td>
      </tr>
    `).join("");

    document.querySelectorAll(".btn-eliminar").forEach(b => {
      b.addEventListener("click", async () => {
        await fetch(`${API_URL}/clientes/${b.dataset.id}`, { method: "DELETE" });
        listarClientes();
      });
    });

    document.querySelectorAll(".btn-editar").forEach(b => {
      b.addEventListener("click", async () => {
        const res = await fetch(`${API_URL}/clientes/${b.dataset.id}`);
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
    const url = id ? `${API_URL}/clientes/${id}` : `${API_URL}/clientes/`;
    await fetch(url, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cliente)
    });
    document.getElementById("formCliente").reset();
    listarClientes();
  });

  document.getElementById("cancelarEdicion").addEventListener("click", () => {
    document.getElementById("formCliente").reset();
  });

  document.getElementById("prev").addEventListener("click", () => {
    if (paginaClientes > 1) paginaClientes--;
    listarClientes();
  });

  document.getElementById("next").addEventListener("click", () => {
    paginaClientes++;
    listarClientes();
  });

  listarClientes();
}
