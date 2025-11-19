document.addEventListener("DOMContentLoaded", () => {
  const contenido = document.getElementById("contenido");

  function mostrarInicio() {
    contenido.innerHTML = `
      <section class="inicio">
        <h2>Bienvenido al Sistema de Gestión</h2>
        <p>Seleccione una opción del menú para administrar Puertas, Ventanas y Ventas.</p>
      </section>
    `;
  }

  document.querySelectorAll("nav button").forEach(btn => {
    btn.addEventListener("click", () => {
      const seccion = btn.dataset.section;
      if (seccion === "clientes") cargarClientes();
      if (seccion === "productos") cargarProductos();
      if (seccion === "ventas") cargarVentas();
    });
  });

  mostrarInicio();
});