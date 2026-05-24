//? PRELOAD.JS - Puente entre main.js y las vistas
const { contextBridge, ipcRenderer } = require("electron")

//* Crea un objeto llamado 'api' accesible desde timer.js como window.api
contextBridge.exposeInMainWorld('api', {
	//Guarda la configuracion en el archivo JSON
	guardarConfig: (config) => ipcRenderer.send('guardar-config', config),
	//Pide la configuracion guardada y la devuelve
	cargarConfig: () => ipcRenderer.invoke('cargar-config'),

	//Zona de funciona paara el blocker.js
	//Recibe los datos del descanso desde main.js
	recibirDatosDescanso: (callback) => ipcRenderer.on('datos-descanso', (event, datos)=> callback(datos)),
	//Cierra la ventana del blocker cuando termine el descanso
	cerrarBlocker: (opciones) => ipcRenderer.send('cerrar-blocker', opciones),

	// Abre la pantalla de bloqueo
    abrirBlocker: (datos) => ipcRenderer.send('abrir-blocker', datos),

	// Recibe la señal de volver a settings cuando completa todos los ciclos
	volverASettings: (callback) => ipcRenderer.on('volver-a-settings', () => callback()),

	//Obtiene la APO key de Giphy de forma segura
	obtenerGiphyKey: () => ipcRenderer.invoke('obtener-giphy-key'),

	// Busca GIFs desde el proceso principal
	buscarGiphy: (query, tipo) => ipcRenderer.invoke('buscar-giphy', { query, tipo }),

	// Abre el explorador de archivos para elegir imagen
	seleccionarImagenCustom: () => ipcRenderer.invoke('seleccionar-imagen-custom'),

	// Guarda una imagen custom copiándola a la carpeta de datos
	guardarImagenCustom: (rutaOrigen) => ipcRenderer.invoke('guardar-imagen-custom', rutaOrigen),

	// Obtiene la lista de imágenes custom guardadas
	obtenerImagenesCustom: () => ipcRenderer.invoke('obtener-imagenes-custom'),

	// Elimina una imagen custom
	eliminarImagenCustom: (nombre) => ipcRenderer.invoke('eliminar-imagen-custom', nombre),
})