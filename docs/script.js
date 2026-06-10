// ==============================
// MODO CLARO / OSCURO
// Guarda la preferencia del usuario en localStorage
// para que persista al recargar la página
// ==============================

const btnTema   = document.getElementById('btnTema')
const iconoTema = document.getElementById('iconoTema')

// Al cargar la página recupera el tema guardado
// Si no hay ninguno guardado usa claro por defecto
const temaGuardado = localStorage.getItem('tema') || 'light'
document.body.className = temaGuardado
actualizarIcono(temaGuardado)

// Cuando el usuario hace clic cambia el tema
btnTema.addEventListener('click', () => {
    const esOscuro = document.body.classList.contains('dark')

    if (esOscuro) {
        document.body.className = 'light'
        localStorage.setItem('tema', 'light')
        actualizarIcono('light')
    } else {
        document.body.className = 'dark'
        localStorage.setItem('tema', 'dark')
        actualizarIcono('dark')
    }
})

// Actualiza el ícono según el tema activo
// En claro muestra luna, en oscuro muestra sol
function actualizarIcono(tema) {
    if (tema === 'dark') {
        iconoTema.className = 'fa-regular fa-sun'
    } else {
        iconoTema.className = 'fa-regular fa-moon'
    }
}