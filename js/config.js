// Configuración Global de la API
const BASE_URL = "https://back.mindcube.cloud";


window.API_URL = {
    clientes: `${BASE_URL}/clientes/`,
    productos: `${BASE_URL}/productos/`,
    ventas: `${BASE_URL}/ventas/`
};

console.log("🔗 Sistema conectado a:", BASE_URL);