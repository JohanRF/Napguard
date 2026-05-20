//* Importo las herramientas app y BrowserWindow de Electron
const {app, BrowserWindow, ipcMain, Notification} = require('electron')
//* Importo path para contruir rutas de archivos.
const path = require('path')
//* Permite leer y escribir archivos en el disco
const fs = require('fs')

//* Referencia a la ventana del blocker
let blockerWin = null;
let mainWin = null;

//? Ruta donde se guarda la configuracion del usuario
const rutaConfig = path.join(
	app.getPath('userData'),
	'user-settings.json'
)

//? Configuracion por defecto si no existe archivo guardado
const configPorDefecto = {
	concentracion: 30,
	descanso: 5,
	ciclosTotales: 4,
	personaje: 'gato',
	modoOscuro: false
}

if (!fs.existsSync(rutaConfig)) {

	fs.writeFileSync(
		rutaConfig,
		JSON.stringify(configPorDefecto, null, 2)
	)

}

//? Funcion que crea y configura la ventana prnicipal
function createWindow() {

	//*Nueva ventana con tamaño y configuración definida
	mainWin = new BrowserWindow({
		width: 420,
		height: 560,
		autoHideMenuBar:true,
		resizable:false,
		webPreferences: {
			//* Conecto el puente entre main.js y el HTML
			preload: path.join(__dirname, 'preload.js')
		}
	})

	//* Le digo a la ventana que HTML debe mostrar
	mainWin.loadFile('src/windows/timer.html');

	//Permite cargar recursos externos como FontAwesome
	mainWin.webContents.session.webRequest.onHeadersReceived((details, callback)=> {
		callback({
			responseHeaders:{
				...details.responseHeaders,
				'Content-Security-Policy': ["default-src 'self' 'unsafe-inline' https://kit.fontawesome.com https://ka-f.fontawesome.com https://fonts.googleapis.com https://fonts.gstatic.com"]
			}
		})
	})
}

//* Cuando electron este listo (.whenReady()), abre la ventana(.then())
app.whenReady().then(()=>{
	createWindow();
})

//*Escucha cuando timer.js quiere guardar la configuracion
ipcMain.on('guardar-config', (event, config) =>{
	//Convierte el objeto JS a texto JSON y los escribe en el archivo
	fs.writeFileSync(rutaConfig, JSON.stringify(config, null, 2))
})

//* Abre la ventana del blocker encima de todo
ipcMain.on('abrir-blocker', (event, datos)=>{
	//Obtiene el tamaño competo del monitor
	const {screen} = require('electron');
	const display = screen.getPrimaryDisplay();
	const {width, height} = display.bounds;

	blockerWin = new BrowserWindow({
		width: width,
		height: height,
		frame: false,           // Sin bordes ni barra de título
        alwaysOnTop: true,      // Siempre encima de todo
        transparent: true,      // Fondo transparente
        skipTaskbar: true,      // No aparece en la barra de tareas
        fullscreen: true, 		// Pantalla completa
		focusable: true,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js')
		}
	})

	blockerWin.setAlwaysOnTop(true, 'screen-saver')
	blockerWin.loadFile('src/windows/blocker.html')

	//Cuando carga envia los datos del descanso al blocker
	blockerWin.webContents.once('did-finish-load', ()=>{
		blockerWin.webContents.send('datos-descanso', datos);
	})
})

//* Cierra el blocker cuando termine el descanso
ipcMain.on('cerrar-blocker', (event, opciones) =>{
	if (blockerWin) {
		blockerWin.close();
		blockerWin = null;
	}

    // Verifica que opciones existe antes de usarlo
    const esUltimo = opciones && opciones.esUltimoCiclo

	// Si es el último ciclo muestra la notificación y vuelve a settings
    if (esUltimo) {

        // Notificación nativa del sistema operativo
        const notif = new Notification({
            title: '🎉 NapGuard',
            body: '¡Completaste todos tus ciclos! Buen trabajo.',
            silent: false
        })
        notif.show()

        // Muestra la ventana principal y la trae al frente
        if (mainWin) {
            mainWin.show()
            mainWin.focus()
            // Le dice al timer.js que vuelva a la vista settings
            mainWin.webContents.send('volver-a-settings')
        }
    }
})


//* Escucha cuando timer.js pide cargar la configuracion guardada
ipcMain.handle('cargar-config', () =>{
	try{
		//Intenta leer el archivo guardado
		const datos = fs.readFileSync(rutaConfig, 'utf-8')
		//Convierte el texto JSON a objeto JS y lo devuelve
		return JSON.parse(datos)
	}catch{
		//Si no existe el archivo devuelve la configuracion por defecto
		return configPorDefecto
	}
})

//* Cuando se cierran todas la ventanas, cierra la app
// darwin = MacOS, en Window y Linux se cierra directo.
app.on('window-all-closed', ()=>{
	if (process.platform !== 'darwin') {
		app.quit();
	}
})