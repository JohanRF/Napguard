//? BLOCKER.JS - Pantalla de bloqueo durante el descanso

// Fuerza el foco en la ventana para que reciba eventos de teclado
window.focus()
document.body.focus()

// Variables declaradas fuera para que keydown pueda accederlas
let intervalo = null
let datosDescanso = null // Guarda los datos para usarlos en el ESC

// Variaabl para el intervalo de animacion
let animacionMovimiento = null;
//* Recibe el tiempo y el animal desde main.js via preload
window.api.recibirDatosDescanso((datos) => {
    // Guarda los datos globalmente para que ESC pueda usarlos
    datosDescanso = datos;

    const animalImg = document.getElementById('animalImg')
    const contenedor = document.querySelector('.blockerCenter')

    // Aplica la configuracion visual del fondo
    if (datos.configBlocker) {
        const config = datos.configBlocker

        // Convierte el color hex a RGB para poder aplicar la opacidad
        const hex = config.colorFondo.replace('#', '')
        const r = parseInt(hex.substring(0, 2), 16)
        const g = parseInt(hex.substring(2, 4), 16)
        const b = parseInt(hex.substring(4, 6), 16)

        // Convierte el porcentaje de difuminado a valor de opacidad 0-1
        const opacidad = (100 - config.difuminado) / 100;

        // Aplica el color con la opacidad al fondo del body
        document.body.style.background = `rgba(${r}, ${g}, ${b}, ${opacidad})`;

        if (config.pantallaCompleta) {
            //Pantalla completa - imagen ocupa todo el monitor
            contenedor.style.position = 'fixed'
            contenedor.style.top = '0'
            contenedor.style.left = '0'
            contenedor.style.width = '100vw'
            contenedor.style.height = '100vh'
            animalImg.style.width = '100%'
            animalImg.style.height = '100%'
            animalImg.style.objectFit = 'contain'
        }else{
            // Posición en una de las 9 zonas
            contenedor.style.position = 'fixed'
            contenedor.style.width = 'auto'
            contenedor.style.height = 'auto'
            animalImg.style.width = '420px'
            animalImg.style.height = '420px'
            animalImg.style.objectFit = 'contain'

            // Mapea la posición elegida a coordenadas CSS
            const posiciones = {
                'top-left':      { top: '0',    left: '0',    right: 'auto',   bottom: 'auto'  },
                'top-center':    { top: '0',    left: '50%',  right: 'auto',   bottom: 'auto',  transform: 'translateX(-50%)' },
                'top-right':     { top: '0',    left: 'auto', right: '0',      bottom: 'auto'  },
                'middle-left':   { top: '50%',  left: '0',    right: 'auto',   bottom: 'auto',  transform: 'translateY(-50%)' },
                'middle-center': { top: '50%',  left: '50%',  right: 'auto',   bottom: 'auto',  transform: 'translate(-50%, -50%)' },
                'middle-right':  { top: '50%',  left: 'auto', right: '0',      bottom: 'auto',  transform: 'translateY(-50%)' },
                'bottom-left':   { top: 'auto', left: '0',    right: 'auto',   bottom: '0'     },
                'bottom-center': { top: 'auto', left: '50%',  right: 'auto',   bottom: '0',     transform: 'translateX(-50%)' },
                'bottom-right':  { top: 'auto', left: 'auto', right: '0',      bottom: '0'     }
            }

            const pos = posiciones[config.posicion] || posiciones['middle-center']

            // Aplica las coordenadas al contenedor
            contenedor.style.top = pos.top
            contenedor.style.left = pos.left
            contenedor.style.right = pos.right
            contenedor.style.bottom = pos.bottom
            contenedor.style.transform = pos.transform || 'none'
        }

        // --- APLICACIÓN DE ESTILOS DE TEXTO AL CONTADOR ---
        const tiempoEl = document.getElementById('tiempoDescanso')
        
        // Color
        if (config.textColor) {
            tiempoEl.style.color = config.textColor
        }

        // Tamaño
        if (config.textSize) {
            tiempoEl.style.fontSize = `${config.textSize}px`
        }

        // Posición en 9 zonas para el texto
        if (config.textPosition) {
            const posicionesTexto = {
                'top-left':      { top: '2%',  left: '1%',  right: 'auto', bottom: 'auto', transform: 'none' },
                'top-center':    { top: '2%',  left: '50%', right: 'auto', bottom: 'auto', transform: 'translateX(-50%)' },
                'top-right':     { top: '2%',  left: 'auto',right: '1%',  bottom: 'auto', transform: 'none' },
                'middle-left':   { top: '50%', left: '1%',  right: 'auto', bottom: 'auto', transform: 'translateY(-50%)' },
                'middle-center': { top: '50%', left: '50%', right: 'auto', bottom: 'auto', transform: 'translate(-50%, -50%)' },
                'middle-right':  { top: '50%', left: 'auto',right: '1%',  bottom: 'auto', transform: 'translateY(-50%)' },
                'bottom-left':   { top: 'auto',left: '1%',  right: 'auto', bottom: '2%',  transform: 'none' },
                'bottom-center': { top: 'auto',left: '50%', right: 'auto', bottom: '2%',  transform: 'translateX(-50%)' },
                'bottom-right':  { top: 'auto',left: 'auto',right: '1%',  bottom: '2%',  transform: 'none' }
            }
            const posTxt = posicionesTexto[config.textPosition] || posicionesTexto['top-center']
            
            tiempoEl.style.position = 'fixed'
            tiempoEl.style.top = posTxt.top
            tiempoEl.style.left = posTxt.left
            tiempoEl.style.right = posTxt.right
            tiempoEl.style.bottom = posTxt.bottom
            tiempoEl.style.transform = posTxt.transform
        }

        // Cargar fuente offline dinámicamente si no es la por defecto
        if (config.textFont && config.textFont !== 'Press Start 2P' && config.textFontPath) { 
            const fontUrl = config.textFontPath.replace(/\\/g, '/')
            const nombreFamilia = config.textFont.replace(/\s+/g, '')
            
            // Usamos FontFace API para cargar la fuente descargada en disco
            const font = new FontFace(nombreFamilia, `url("file:///${fontUrl}")`)
            font.load().then((loadedFont) => {
                document.fonts.add(loadedFont)
                tiempoEl.style.fontFamily = `'${nombreFamilia}', sans-serif`
                console.log(`Fuente offline aplicada en blocker: ${nombreFamilia}`)
            }).catch((err) => {
                console.error(`Error al cargar fuente offline en blocker:`, err)
            })
        } else {
            tiempoEl.style.fontFamily = `'Press Start 2P', monospace`
        }
    }
    
    // Detecta el tipo de personaje y asigna la ruta correcta
    if (!datos.personaje) {
        // Sin selección — usa el gato por defecto
        animalImg.src = `../assets/images/gato.png`
    } else if (datos.personaje.startsWith('http')) {
        // Es una URL de Giphy — la usa directamente
        animalImg.src = datos.personaje
    } else if (datos.personaje.includes('\\') || datos.personaje.includes('/')) {
        // Es una ruta local de Custom
        animalImg.src = datos.personaje
    } else {
        // Es un nombre de imagen de categoría
        animalImg.src = `../assets/images/${datos.personaje}.png`
    }

    // Inicia el contador regresivo con el tiempo de descanso
    let segundos = datos.segundos
    const tiempoEl = document.getElementById('tiempoDescanso')

    intervalo = setInterval(() => {
        segundos--

        // Formatea los segundos a MM:SS
        const min = Math.floor(segundos / 60).toString().padStart(2, '0')
        const seg = (segundos % 60).toString().padStart(2, '0')
        tiempoEl.textContent = `${min}:${seg}`

        // Cuando termina el descanso cierra con opciones
        if (segundos <= 0) {
            clearInterval(intervalo)
            window.api.cerrarBlocker({ esUltimoCiclo: datos.esUltimoCiclo })
        }
    }, 1000)

    // Aplica el movimiento si está configurado
    if (datos.configBlocker && datos.configBlocker.movimiento !== 'ninguno') {
        const config = datos.configBlocker
        const contenedor = document.querySelector('.blockerCenter')
        const ancho = window.screen.width
        const anchoImg = animalImg.offsetWidth

        // Velocidad — convierte 1-10 a pixeles por frame
        const velocidad = config.velocidad || 5
        const px = velocidad * 2

        // Posición inicial según dirección
        let posX = config.movimiento === 'ltr' ? -anchoImg : ancho
        contenedor.style.position = 'fixed'
        contenedor.style.top = '50%'
        contenedor.style.transform = 'translateY(-50%)'
        contenedor.style.left = posX + 'px'

        // Dirección inicial
        let direccion = config.movimiento === 'ltr' ? 1 : -1

        // Inicia la animación
        animacionMovimiento = setInterval(() => {
            posX += px * direccion

            if (config.tipoMovimiento === 'atravesar') {
                // Reaparece por el lado opuesto
                if (posX > ancho) posX = -anchoImg
                if (posX < -anchoImg) posX = ancho

            } else if (config.tipoMovimiento === 'idaVuelta') {
                // Rebota en los bordes
                if (posX + anchoImg >= ancho) {
                    posX = ancho - anchoImg
                    direccion = -1
                }
                if (posX <= 0) {
                    posX = 0
                    direccion = 1
                }
            }

            contenedor.style.left = posX + 'px'

            //Voltea la imagen segun la dirección actual
            animalImg.style.transform = direccion > 0 ? 'scaleX(1)' : 'scaleX(-1)'
        }, 16) // 60fps aproximado
    }
})

//* Tecla ESC para desbloquear en emergencia
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        clearInterval(intervalo)

        //Detiene la animacion antes de cerrar
        if (animacionMovimiento) {
            clearInterval(animacionMovimiento);
            animacionMovimiento = null;
        }

        // Pasa esUltimoCiclo igual que cuando termina naturalmente
        window.api.cerrarBlocker({
            esUltimoCiclo: datosDescanso && datosDescanso.esUltimoCiclo
        })
    }
})