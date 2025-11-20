let carrito = []; 

async function cargarVentas() {
    const contenido = document.getElementById("contenido");
    contenido.innerHTML = `
        <div class="ventas-layout">
            <div style="display:flex; flex-direction:column; gap: 1.5rem;">
                <section class="card">
                    <h3>1. Datos de Venta</h3>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1rem;">
                        <select id="clienteVenta"></select>
                        <select id="formaPago">
                            <option value="Efectivo">💵 Efectivo</option>
                            <option value="Transferencia">🏦 Transferencia</option>
                            <option value="Tarjeta">💳 Tarjeta</option>
                        </select>
                    </div>
                </section>

                <section class="card" style="flex:1;">
                    <h3>2. Agregar Productos</h3>
                    <div style="display:flex; gap:10px; align-items:end; background: #f8fafc; padding:1rem; border-radius:8px; border:1px solid var(--border);">
                        <div style="flex:1;">
                            <label style="font-size:0.85rem; color:var(--text-light)">Producto</label>
                            <select id="productoSelect" style="margin-top:0.3rem;"></select>
                        </div>
                        <div style="width:80px;">
                            <label style="font-size:0.85rem; color:var(--text-light)">Cant.</label>
                            <input type="number" id="cantidadInput" value="1" min="1" style="margin-top:0.3rem;">
                        </div>
                        <button type="button" id="btnAgregar" class="btn-primary">➕ Añadir</button>
                    </div>
                    
                    <div style="margin-top:2rem;">
                        <h3>📜 Historial Reciente</h3>
                        <table id="historialVentas">
                            <thead><tr><th>Cliente</th><th>Total</th><th>Fecha</th></tr></thead>
                            <tbody></tbody>
                        </table>
                    </div>
                </section>
            </div>

            <section class="carrito-panel">
                <div>
                    <h3 style="border-bottom:1px solid var(--border); padding-bottom:1rem;">🛒 Carrito</h3>
                    <div style="overflow-y:auto; max-height: 400px;">
                        <table style="margin-top:10px;">
                            <tbody id="tablaCarrito"></tbody>
                        </table>
                    </div>
                </div>
                <div style="border-top:1px solid var(--border); padding-top:1rem;">
                    <div style="display:flex; justify-content:space-between; font-size:1.2rem;">
                        <span>Total:</span>
                        <span id="totalVenta" style="font-weight:bold; color:var(--primary);">0 Gs</span>
                    </div>
                    <button id="btnFinalizarVenta" style="width:100%; margin-top:1rem; background: var(--success);">✅ CONFIRMAR VENTA</button>
                </div>
            </section>
        </div>
    `;

    await cargarSelectores();
    listarVentas();

    document.getElementById("btnAgregar").addEventListener("click", () => {
        const select = document.getElementById("productoSelect");
        const id = parseInt(select.value);
        if (!id) return alert("Seleccione un producto");
        
        const nombre = select.options[select.selectedIndex].text.split(" (Stock")[0];
        const precio = parseFloat(select.options[select.selectedIndex].dataset.precio);
        const cant = parseInt(document.getElementById("cantidadInput").value);

        const existente = carrito.find(i => i.producto_id === id);
        if (existente) existente.cantidad += cant;
        else carrito.push({ producto_id: id, nombre, precio, cantidad: cant });
        
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

        const res = await fetch(API_URL.ventas, {
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
            alert("Error: " + (error.detail || "Error desconocido"));
        }
    });
}

function renderCarrito() {
    const tbody = document.getElementById("tablaCarrito");
    let total = 0;
    
    if (carrito.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" style="text-align:center; color:var(--text-light);">Vacío</td></tr>';
        document.getElementById("totalVenta").innerText = "0 Gs";
        return;
    }

    tbody.innerHTML = carrito.map((item, index) => {
        const sub = item.precio * item.cantidad;
        total += sub;
        return `
        <tr>
            <td>
                <div style="font-weight:600">${item.nombre}</div>
                <small>${item.cantidad} x ${item.precio.toLocaleString()}</small>
            </td>
            <td style="text-align:right;">${sub.toLocaleString("es-PY")}</td>
            <td style="text-align:right;"><button onclick="eliminarDelCarrito(${index})" style="color:red; border:none; background:none; cursor:pointer;">&times;</button></td>
        </tr>`;
    }).join("");
    document.getElementById("totalVenta").innerText = total.toLocaleString("es-PY") + " Gs";
}

window.eliminarDelCarrito = (index) => { carrito.splice(index, 1); renderCarrito(); };

async function cargarSelectores() {
    const [resC, resP] = await Promise.all([
        fetch(API_URL.clientes),
        fetch(API_URL.productos)
    ]);
    const clientes = await resC.json();
    const productos = await resP.json();

    document.getElementById("clienteVenta").innerHTML = "<option value=''>-- Cliente --</option>" + clientes.map(c => `<option value="${c.id}">${c.nombre}</option>`).join("");
    
    document.getElementById("productoSelect").innerHTML = "<option value=''>-- Producto --</option>" + productos.map(p => 
        `<option value="${p.id}" data-precio="${p.precio}">${p.nombre} (Stock: ${p.stock})</option>`
    ).join("");
}

async function listarVentas() {
    const res = await fetch(API_URL.ventas);
    const ventas = await res.json();
    const ultimas = ventas.slice(-5).reverse();
    
    document.querySelector("#historialVentas tbody").innerHTML = ultimas.map(v => `
        <tr>
            <td>${v.cliente.nombre}</td>
            <td style="font-weight:bold;">${v.total.toLocaleString("es-PY")}</td>
            <td style="font-size:0.8rem; color:grey;">${new Date(v.fecha).toLocaleDateString()}</td>
        </tr>
    `).join("");
}