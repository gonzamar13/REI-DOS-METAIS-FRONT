const API_URL = "http://127.0.0.1:8000";
let paginaProductos = 1;
const LIMITE_PRODUCTOS = 5;

async function cargarProductos() {
    const contenido = document.getElementById("contenido");
    contenido.innerHTML = `
        <section class="form-section">
            <h2>Gestión de Productos (Stock)</h2>
            <form id="formProducto">
                <input type="hidden" id="idProducto">
                <input type="text" id="nombre" placeholder="Nombre (Ej: Puerta Hierro)" required>
                <select id="tipo" required>
                    <option value="">Seleccione Tipo</option>
                    <option value="Puerta">Puerta</option>
                    <option value="Ventana">Ventana</option>
                    <option value="Otro">Otro</option>
                </select>
                <input type="number" id="stock" placeholder="Stock Actual" required min="0">
                <input type="number" step="0.01" id="precio" placeholder="Precio (Gs)" required>
                <button type="submit">💾 Guardar</button>
                <button type="button" id="cancelarEdicion" class="btn-secundario">❌ Limpiar</button>
            </form>
        </section>

        <section class="tabla-section">
            <h2>Inventario</h2>
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Tipo</th>
                        <th>Stock</th>
                        <th>Precio</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody id="tablaProductos"></tbody>
            </table>
        </section>
    `;

    document.getElementById("formProducto").addEventListener("submit", async e => {
        e.preventDefault();
        const id = document.getElementById("idProducto").value;
        const producto = {
            nombre: document.getElementById("nombre").value,
            tipo: document.getElementById("tipo").value,
            stock: parseInt(document.getElementById("stock").value),
            precio: parseFloat(document.getElementById("precio").value),
        };
        
        const url = id ? `${API_URL}/productos/${id}` : `${API_URL}/productos/`;
        const method = id ? "PUT" : "POST";

        await fetch(url, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(producto)
        });
        
        document.getElementById("formProducto").reset();
        document.getElementById("idProducto").value = "";
        listarProductos();
    });

    document.getElementById("cancelarEdicion").addEventListener("click", () => {
        document.getElementById("formProducto").reset();
        document.getElementById("idProducto").value = "";
    });

    listarProductos();
}

async function listarProductos() {
    const res = await fetch(`${API_URL}/productos/`);
    const productos = await res.json();
    const tabla = document.getElementById("tablaProductos");
    
    tabla.innerHTML = productos.map(p => `
        <tr>
            <td>${p.nombre}</td>
            <td>${p.tipo}</td>
            <td style="font-weight:bold; color: ${p.stock < 5 ? 'red' : 'green'}">${p.stock}</td>
            <td>${p.precio.toLocaleString("es-PY")}</td>
            <td>
                <button class="btn-editar" onclick='editarProducto(${JSON.stringify(p)})'>✏️</button>
                <button class="btn-eliminar" onclick='eliminarProducto(${p.id})'>🗑️</button>
            </td>
        </tr>
    `).join("");
}

window.editarProducto = (p) => {
    document.getElementById("idProducto").value = p.id;
    document.getElementById("nombre").value = p.nombre;
    document.getElementById("tipo").value = p.tipo;
    document.getElementById("stock").value = p.stock;
    document.getElementById("precio").value = p.precio;
};

window.eliminarProducto = async (id) => {
    if(confirm("¿Eliminar producto?")) {
        await fetch(`${API_URL}/productos/${id}`, { method: "DELETE" });
        listarProductos();
    }
};
window.cargarProductos = cargarProductos;