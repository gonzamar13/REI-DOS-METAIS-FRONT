let carrito = []; // Array para manejar múltiples productos en una venta

async function cargarVentas() {
    const contenido = document.getElementById("contenido");
    contenido.innerHTML = `
        <section class="form-section">
            <h2>Registrar Nueva Venta</h2>
            <div style="display:flex; gap:10px; align-items:center; margin-bottom:10px;">
                <select id="clienteVenta" style="flex:1;"></select>
                <select id="formaPago" style="flex:1;">
                    <option value="Efectivo">Efectivo</option>
                    <option value="Transferencia">Transferencia</option>
                    <option value="Tarjeta">Tarjeta</option>
                </select>
            </div>
            
            <div style="background:#f0f0f0; padding:10px; border-radius:5px;">
                <h4>Agregar Ítems</h4>
                <div style="display:flex; gap:10px;">
                    <select id="productoSelect" style="flex:2;"></select>
                    <input type="number" id="cantidadInput" value="1" min="1" style="width:60px;">
                    <button type="button" id="btnAgregar" style="background:#28a745;">➕ Agregar</button>
                </div>
            </div>

            <table style="margin-top:10px;">
                <thead><tr><th>Producto</th><th>Cant</th><th>Subtotal</th><th></th></tr></thead>
                <tbody id="tablaCarrito"></tbody>
            </table>
            <h3 style="text-align:right">Total: <span id="totalVenta">0</span> Gs</h3>

            <button id="btnFinalizarVenta" style="width:100%; margin-top:10px;">💾 CONFIRMAR VENTA</button>
        </section>

        <section class="tabla-section">
            <h2>Historial de Ventas</h2>
            <table id="historialVentas">
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Cliente</th>
                        <th>Detalle</th>
                        <th>Pago</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </section>
    `;

    await cargarSelectores();
    listarVentas();

    // Lógica del Carrito
    document.getElementById("btnAgregar").addEventListener("click", () => {
        const select = document.getElementById("productoSelect");
        const id = parseInt(select.value);
        const nombre = select.options[select.selectedIndex].text;
        const precio = parseFloat(select.options[select.selectedIndex].dataset.precio);
        const cant = parseInt(document.getElementById("cantidadInput").value);

        if (!id) return alert("Seleccione un producto");

        // Buscar si ya existe en carrito para sumar
        const existente = carrito.find(i => i.producto_id === id);
        if (existente) {
            existente.cantidad += cant;
        } else {
            carrito.push({ producto_id: id, nombre, precio, cantidad: cant });
        }
        renderCarrito();
    });

    document.getElementById("btnFinalizarVenta").addEventListener("click", async () => {
        const cliente_id = document.getElementById("clienteVenta").value;
        if (!cliente_id || carrito.length === 0) return alert("Seleccione cliente y productos");

        const venta = {
            cliente_id: parseInt(cliente_id),
            forma_de_pago: document.getElementById("formaPago").value,
            detalles: carrito.map(c => ({ producto_id: c.producto_id, cantidad: c.cantidad }))
        };

        const res = await fetch(`${API_URL}/ventas/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(venta)
        });

        if (res.ok) {
            alert("Venta registrada con éxito");
            carrito = [];
            renderCarrito();
            listarVentas();
        } else {
            const error = await res.json();
            alert("Error: " + error.detail);
        }
    });
}

function renderCarrito() {
    const tbody = document.getElementById("tablaCarrito");
    let total = 0;
    tbody.innerHTML = carrito.map((item, index) => {
        const sub = item.precio * item.cantidad;
        total += sub;
        return `<tr>
            <td>${item.nombre}</td>
            <td>${item.cantidad}</td>
            <td>${sub.toLocaleString("es-PY")}</td>
            <td><button onclick="eliminarDelCarrito(${index})" style="background:red; padding:2px 5px;">x</button></td>
        </tr>`;
    }).join("");
    document.getElementById("totalVenta").innerText = total.toLocaleString("es-PY");
}

window.eliminarDelCarrito = (index) => {
    carrito.splice(index, 1);
    renderCarrito();
};

async function cargarSelectores() {
    const [resC, resP] = await Promise.all([
        fetch(`${API_URL}/clientes/`),
        fetch(`${API_URL}/productos/`)
    ]);
    const clientes = await resC.json();
    const productos = await resP.json();

    const selC = document.getElementById("clienteVenta");
    selC.innerHTML = "<option value=''>-- Cliente --</option>" + clientes.map(c => `<option value="${c.id}">${c.nombre}</option>`).join("");

    const selP = document.getElementById("productoSelect");
    selP.innerHTML = "<option value=''>-- Producto --</option>" + productos.map(p => 
        `<option value="${p.id}" data-precio="${p.precio}">${p.nombre} (Stock: ${p.stock})</option>`
    ).join("");
}

async function listarVentas() {
    const res = await fetch(`${API_URL}/ventas/`);
    const ventas = await res.json();
    const tbody = document.querySelector("#historialVentas tbody");
    
    tbody.innerHTML = ventas.map(v => `
        <tr>
            <td>${new Date(v.fecha).toLocaleDateString()}</td>
            <td>${v.cliente.nombre}</td>
            <td>${v.detalles.map(d => `${d.cantidad} x ${d.producto_nombre}`).join(", ")}</td>
            <td>${v.forma_de_pago}</td>
            <td>${v.total.toLocaleString("es-PY")} Gs</td>
        </tr>
    `).join("");
}

window.cargarVentas = cargarVentas;