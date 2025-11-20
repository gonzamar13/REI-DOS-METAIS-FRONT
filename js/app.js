document.addEventListener("DOMContentLoaded", () => {
  const contenido = document.getElementById("contenido");
  const tituloSeccion = document.getElementById("titulo-seccion");
  const navButtons = document.querySelectorAll(".navbar button");

  function mostrarInicio() {
    tituloSeccion.innerText = "Bienvenido";
    contenido.innerHTML = `
      <div class="card" style="text-align: center; padding: 3rem;">
        <h2 style="font-size: 2rem; color: var(--primary);">👋 Bienvenido al Sistema de Gestión</h2>
        <p style="color: var(--secondary); max-width: 600px; margin: 1rem auto;">
            Seleccione una opción del menú lateral para comenzar a administrar Clientes, Inventario y Ventas.
        </p>
        <div style="display: flex; gap: 1rem; justify-content: center; margin-top: 2rem;">
            <button onclick="cargarVentas()" class="btn-primary">💰 Nueva Venta</button>
            <button onclick="cargarProductos()" class="btn-secundario">📦 Ver Stock</button>
        </div>
      </div>
    `;
  }

  navButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      // Actualizar estado activo visual
      navButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const seccion = btn.dataset.section;
      
      if (seccion === "inicio") mostrarInicio();
      if (seccion === "clientes") { tituloSeccion.innerText = "Gestión de Clientes"; cargarClientes(); }
      if (seccion === "productos") { tituloSeccion.innerText = "Inventario de Productos"; cargarProductos(); }
      if (seccion === "ventas") { tituloSeccion.innerText = "Punto de Venta"; cargarVentas(); }
    });
  });

  mostrarInicio();
  
  // Exponer funciones al contexto global para los botones de inicio
  window.cargarVentas = () => { document.querySelector('[data-section="ventas"]').click(); };
  window.cargarProductos = () => { document.querySelector('[data-section="productos"]').click(); };
});