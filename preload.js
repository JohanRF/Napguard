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
	volverASettings: (callback) => ipcRenderer.on('volver-a-settings', () => callback())
})