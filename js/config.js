// Configuración Global de la API
const BASE_URL = "https://rei-dos-metais-backend-gd9kgn-f78151-109-199-112-8.traefik.me";

// Definimos las rutas exactas según tu Swagger (OpenAPI)
// IMPORTANTE: Tu backend pide barra al final (/clientes/), así que la incluimos aquí.
window.API_URL = {
    clientes: `${BASE_URL}/clientes/`,
    productos: `${BASE_URL}/productos/`,
    ventas: `${BASE_URL}/ventas/`
};

console.log("🔗 Sistema conectado a:", BASE_URL);