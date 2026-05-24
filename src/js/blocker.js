//? BLOCKER.JS - Pantalla de bloqueo durante el descanso

// Fuerza el foco en la ventana para que reciba eventos de teclado
window.focus()
document.body.focus()

// Variables declaradas fuera para que keydown pueda accederlas
let intervalo = null
let datosDescanso = null // Guarda los datos para usarlos en el ESC

//* Recibe el tiempo y el animal desde main.js via preload
window.api.recibirDatosDescanso((datos) => {
    // Guarda los datos globalmente para que ESC pueda usarlos
    datosDescanso = datos

    // Aplica el animal seleccionado
    const animalImg = document.getElementById('animalImg')
    
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
})

//* Tecla ESC para desbloquear en emergencia
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        clearInterval(intervalo)
        // Pasa esUltimoCiclo igual que cuando termina naturalmente
        window.api.cerrarBlocker({
            esUltimoCiclo: datosDescanso && datosDescanso.esUltimoCiclo
        })
    }
})