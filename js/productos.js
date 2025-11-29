async function cargarProductos() {
    const contenido = document.getElementById("contenido");
    contenido.innerHTML = `
        <section class="card">
            <h3>📦 Gestión de Stock</h3>
            <form id="formProducto" style="grid-template-columns: 2fr 1fr 1fr 1fr auto;">
                <input type="hidden" id="idProducto">
                <input type="text" id="nombre" placeholder="Nombre del Producto" required>
                <select id="tipo" required>
                    <option value="">Tipo</option>
                    <option value="Puerta">Puerta</option>
                    <option value="Ventana">Ventana</option>
                    <option value="Otro">Otro</option>
                </select>
                <input type="number" id="stock" placeholder="Stock" required min="0">
                <input type="number" step="0.01" id="precio" placeholder="Precio (Gs)" required>
                <div style="display:flex; gap:0.5rem">
                    <button type="submit">Guardar</button>
                    <button type="button" id="cancelarEdicion" class="btn-secundario">Limpiar</button>
                </div>
            </form>
        </section>

        <section class="card">
            <h3>Inventario Actual</h3>
            <table id="tablaProductosContainer">
                <thead>
                    <tr><th>Producto</th><th>Tipo</th><th>Stock</th><th>Precio</th><th style="text-align:right">Acciones</th></tr>
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
        
        const url = id ? `${API_URL.productos}${id}` : API_URL.productos;
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
    const res = await fetch(API_URL.productos);
    const productos = await res.json();
    const tabla = document.getElementById("tablaProductos");
    
    tabla.innerHTML = productos.map(p => {
        let badgeClass = 'badge-success';
        let stockLabel = 'En Stock';
        if (p.stock === 0) { badgeClass = 'badge-danger'; stockLabel = 'Agotado'; }
        else if (p.stock < 5) { badgeClass = 'badge-warning'; stockLabel = 'Bajo'; }

        return `
        <tr>
            <td>
                <div style="font-weight:600">${p.nombre}</div>
                <small style="color:var(--text-light)">ID: ${p.id}</small>
            </td>
            <td><span class="badge" style="background:#f1f5f9; color:#475569">${p.tipo}</span></td>
            <td><span class="badge ${badgeClass}">${p.stock} (${stockLabel})</span></td>
            <td>${p.precio.toLocaleString("es-PY")} ₲</td>
            <td style="text-align:right">
                <button class="btn-editar" style="background:none; border:none; cursor:pointer;" onclick='editarProducto(${JSON.stringify(p)})'>✏️</button>
                <button class="btn-eliminar" style="background:none; border:none; cursor:pointer;" onclick='eliminarProducto(${p.id})'>🗑️</button>
            </td>
        </tr>
    `}).join("");
}

window.editarProducto = (p) => {
    document.getElementById("idProducto").value = p.id;
    document.getElementById("nombre").value = p.nombre;
    document.getElementById("tipo").value = p.tipo;
    document.getElementById("stock").value = p.stock;
    document.getElementById("precio").value = p.precio;
    document.getElementById("nombre").focus();
};

window.eliminarProducto = async (id) => {
    if(confirm("¿Eliminar producto?")) {
        await fetch(`${API_URL.productos}${id}`, { method: "DELETE" });
        listarProductos();
    }
};