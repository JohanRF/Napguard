//? 1. VARIABLES GLOBALES
//Configuracion del usuario:
let concentracion = 30 // min de concentracion
let descanso = 5 // min de descanso corto
let ciclosTotales = 4 // cantidad de ciclos totales
let personaje = null // Hasta que el usuario elija.
let modoOscuro = false // Inicio del modo claro.

//Estado del timer:
let cicloActual = 0        // ciclo en el que vamos
let enDescanso = false     // true si estamos en descanso
let corriendo = false      // true si el timer está activo
let intervalo = null       // guarda el setInterval del timer
let segundosRestantes = 0  // segundos que quedan en el ciclo actual
let segundosTotales = 0    // segundos totales del ciclo actual (para el reloj)

// -- Referencias a elementos del HTML --
// Settings
const sliderConcentracion = document.getElementById('sliderConcentracion')
const sliderDescanso = document.getElementById('sliderDescanso')
const sliderCiclos = document.getElementById('sliderCiclos')

const valConcentracion = document.getElementById('valConcentracion')
const valDescanso = document.getElementById('valDescanso')
const valCiclos = document.getElementById('valCiclos')

const totalSesion = document.getElementById('totalSesion')
const btnEmpezar = document.getElementById('btnEmpezar')

const btnOpciones = document.getElementById('btnOpciones');
const vistaConfig = document.getElementById('vistaConfig');
const btnVolverConfig = document.getElementById('btnVolverConfig');

// Timer
const vistaSettings = document.getElementById('vistaSettings')
const vistaTimer = document.getElementById('vistaTimer')
const estadoActual = document.getElementById('estadoActual')
const ciclosRow = document.getElementById('ciclosRow')
const sesionTag = document.getElementById('sesionTag')
const ringProgress = document.getElementById('ringProgress')
const btnIniciarPausar = document.getElementById('btnIniciarPausar')
const btnSettings = document.getElementById('btnSettings')

// Modo claro/oscuro
const btnModo = document.getElementById('btnModo')
const btnModo2 = document.getElementById('btnModo2')
const iconoModo = document.getElementById('iconoModo')
const iconoModo2 = document.getElementById('iconoModo2')

//? 2. CONFIGURACIÓN — sliders e inputs
// Sincroniza slider con input numerico y viceversa:
function sincronizarSlider(slider, input, actualizar) {
	// Cuando el usuario mueve el slider
	slider.addEventListener('input',()=>{
		//Actualiza el cuadro de texto para que coincida con el slider
		input.value = slider.value
		//Llama la funcion que actualiza la variable correcta
		actualizar(parseInt(slider.value));
		//Recalcula el tiempo total de la sesión inmediatamente
		calcularTotal()
	})

	//Cuando el usuario escribe - espera que termine de escribir:
	input.addEventListener('change', ()=>{
		//Verificar que el numero este dentro del rango permitido:
		//Convierte el texto ingresado a un numero entero
		let valor = parseInt(input.value)
		//Si no es numero valido usa el minimo
		if (isNaN(valor)) valor = parseInt(slider.min)
		//Ajusta al rango permitido
        if (valor < parseInt(slider.min)) valor = parseInt(slider.min)
        if (valor > parseInt(slider.max)) valor = parseInt(slider.max)

		//Sincroniza slider e input con el valor validado
		slider.value = valor;
		input.value = valor;

		//Llama la funcion que actualiza la variable correcta
		actualizar(valor)
		//Recalcula el total
		calcularTotal()
	})
}

// Cada slider recibe una función que actualiza su variable directamente
sincronizarSlider(sliderConcentracion, valConcentracion, (v) => { concentracion = v })
sincronizarSlider(sliderDescanso, valDescanso, (v) => { descanso = v })
sincronizarSlider(sliderCiclos, valCiclos, (v) => { ciclosTotales = v })

//? 3. TOTAL DE SESIÓN — cálculo en tiempo real
// Calcula y muestra el tiempo total de la sesión
function calcularTotal() {
	// Fórmula: ciclos X (concentración + descanso)
	//Suma el tiempo de trabajo y descanso, y lo multiplica por las repeticiones (ciclos)
	const totalMinutos = ciclosTotales * (concentracion + descanso);
	//Obtiene cuantas horas completas hay (ej: 120 min / 60 = 2 horas)
	const horas = Math.floor(totalMinutos / 60);
	//Obtiene el residuo de los minutos (ej: 130 min % 60 = 10 min restantes)
	const minutos = totalMinutos % 60;

	//Formatear el texto segun si hay horas o no
	//Variable para construir el mensaje que vera el usuario
	let texto = '';
	//Si el tiempo llega a ser 1 hora o mas, añade las 'h' al texto
	if(horas > 0) texto += horas + 'h '
	//Si quedan minutos restantes, los añade al texto
	if(minutos > 0) texto += minutos + 'min '
	//Añade eltotal absoluto entre parentesis al final. Por mera decoracion.
	texto += `(${totalMinutos} min)`;
	//Inserte el texto final dentro del elemento HTML correspondiente
	totalSesion.textContent = texto;
}

//? 4. NAVEGACIÓN — cambio entre vistas
//* Controla que vista se muestra al usuario
btnEmpezar.addEventListener('click', ()=>{
	//Guarda la configuracion actual del usuario en el archivo JSON
	window.api.guardarConfig({
		concentracion: concentracion,
		descanso: descanso,
		ciclosTotales: ciclosTotales,
		personaje: personaje,
		modoOscuro: modoOscuro
	})

	//Esconde la vista de settings
	vistaSettings.classList.add('oculto');
	//Muestra la vista del timer
	vistaTimer.classList.remove('oculto');

	//Genera los cuadritos de ciclos según lo configurado
	generarCiclos()

	//Muestra el total de sesion en el tag del timer
	sesionTag.textContent = totalSesion.textContent
	//Prepara el timer con el tiempo de concentracion configurado
	segundosRestantes = concentracion * 60
	segundosTotales = concentracion * 60

	//Actualiza el reloj circular al estado inicial
	actualizarReloj()

	//Arranca el timer automaticamente sin esperar que el usuario presiona INICIAR
	btnIniciarPausar.click()
})

//* Cuando el usuario presiona el boton de configuracion en el timer
btnSettings.addEventListener('click', ()=>{
	//Detiene el timer si estaba corriendo
	clearInterval(intervalo)
	corriendo = false
	intervalo = null

	//Resetea el etado del timer
	cicloActual = 0
	enDescanso = false

	//Esconde el timer y muestra el settings
	vistaTimer.classList.add('oculto');
	vistaSettings.classList.remove('oculto');
})

//* Abrir vista de configuración visual
btnOpciones.addEventListener('click', () => {
    vistaSettings.classList.add('oculto')
    vistaConfig.classList.remove('oculto')
})

//* Volver desde configuración visual
btnVolverConfig.addEventListener('click', () => {
    vistaConfig.classList.add('oculto')
    vistaSettings.classList.remove('oculto')
})

//? 5. MODO CLARO/OSCURO
function toggleModo() {
	//Cambia el valor de la variable
	modoOscuro = !modoOscuro;

	//Agrega o quita la clase dark del body
	document.body.classList.toggle('dark', modoOscuro);

	//Cambia el icono de luna a sol y viceversa en ambas vistas
	const iconoClase = modoOscuro ? 'fa-sun' : 'fa-moon';
	iconoModo.className = `fa-regular ${iconoClase}`;
	iconoModo2.className = `fa-regular ${iconoClase}`;

	//Guarda el modo actual inmediatamente
	window.api.guardarConfig({
		concentracion: concentracion,
        descanso: descanso,
        ciclosTotales: ciclosTotales,
        personaje: personaje,
        modoOscuro: modoOscuro
	})
}

//* Conecta el boton del modo en settings y en timer al mismo funcion
btnModo.addEventListener('click', toggleModo);
btnModo2.addEventListener('click', toggleModo);

//? 5.1 CONFIG VISUAL — Fondo

const colorFondo = document.getElementById('colorFondo')
const sliderDifuminado = document.getElementById('sliderDifuminado')
const valDifuminado = document.getElementById('valDifuminado')

//* Cambia el texto del porcentaje
sliderDifuminado.addEventListener('input', () => {
    valDifuminado.textContent = `${sliderDifuminado.value}%`
})

//? 6. DISEÑO DE DESCANSO - navegacion entre casillas
//* Referencias a los tabs
const tabImagenes = document.getElementById('tabImagenes')
const tabGif = document.getElementById('tabGif')
const tabCustom = document.getElementById('tabCustom')

//* Referencias a los paneles
const panelImagenes = document.getElementById('panelImagenes')
const panelGif = document.getElementById('panelGif')
const panelCustom = document.getElementById('panelCustom')

//* Referencias a las vistas de imágenes
const vistaCategorias = document.getElementById('vistaCategorias')
const vistaImagenesCat = document.getElementById('vistaImagenesCat')
const imagenesGrid = document.getElementById('imagenesGrid')
const tituloCategoriaActual = document.getElementById('tituloCategoriaActual')
const btnVolverCategorias = document.getElementById('btnVolverCategorias')

const btnAgregarCustom = document.getElementById('btnAgregarCustom');

//* Imágenes por categoría — aquí defines las que tienes
const imagenesPorCategoria = {
    animales: [
		{ nombre: 'Gato', archivo: 'gato.png' },
		{ nombre: 'Perro', archivo: 'perro.png' },
		{ nombre: 'Capibara', archivo: 'capibara.png' },

		{ nombre: 'Gato', archivo: 'gato.png' },
		{ nombre: 'Perro', archivo: 'perro.png' },
		{ nombre: 'Capibara', archivo: 'capibara.png' },
		{ nombre: 'Gato', archivo: 'gato.png' },
		{ nombre: 'Perro', archivo: 'perro.png' },
		{ nombre: 'Capibara', archivo: 'capibara.png' },
	],
    anime: [
        // Agrega aquí tus imágenes de anime cuando las tengas
    ],
    futbol: [
        // Agrega aquí tus imágenes de fútbol cuando las tengas
    ]
}

//* Función para cambiar de tab
function cambiarTab(tabActivo, panelActivo) {
    // Quita active de todos los tabs
    ;[tabImagenes, tabGif, tabCustom].forEach(t => t.classList.remove('active'))
    // Oculta todos los paneles
    ;[panelImagenes, panelGif, panelCustom].forEach(p => p.classList.add('oculto'))
    // Activa el tab y panel seleccionado
    tabActivo.classList.add('active')
    panelActivo.classList.remove('oculto')
}

//* Eventos de los tabs
tabImagenes.addEventListener('click', () => cambiarTab(tabImagenes, panelImagenes))
tabGif.addEventListener('click', () => cambiarTab(tabGif, panelGif))
tabCustom.addEventListener('click', () => cambiarTab(tabCustom, panelCustom))

//* Función para mostrar imágenes de una categoría
function mostrarCategoria(categoria) {
    const imagenes = imagenesPorCategoria[categoria] || []

    // Limpia el grid
    imagenesGrid.innerHTML = ''

    // Si no hay imágenes muestra mensaje
    if (imagenes.length === 0) {
        imagenesGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 1rem; font-size: 7px; color: var(--textoSecundario); font-family: 'Press Start 2P', monospace;">
                Próximamente
            </div>`
        return
    }

    // Genera las imágenes
    imagenes.forEach(img => {
        const div = document.createElement('div')
        div.classList.add('imagenOpt')
        div.dataset.personaje = img.archivo.replace('.png', '')
        div.innerHTML = `
            <img src="../assets/images/${img.archivo}" alt="${img.nombre}">
            <span>${img.nombre}</span>
        `
        // Marca como seleccionada si es la activa
        if (personaje === img.archivo.replace('.png', '')) {
            div.classList.add('selected')
        }
        // Al hacer clic selecciona el personaje
        div.addEventListener('click', () => {
            imagenesGrid.querySelectorAll('.imagenOpt').forEach(o => o.classList.remove('selected'))
            div.classList.add('selected')
            personaje = div.dataset.personaje
        })
        imagenesGrid.appendChild(div)
    })
}

//* Eventos de las categorías
document.querySelectorAll('.categoriaOpt').forEach(cat => {
    cat.addEventListener('click', () => {
        const categoria = cat.dataset.categoria
        tituloCategoriaActual.textContent = cat.querySelector('span').textContent
        // Oculta categorías y muestra imágenes
        vistaCategorias.classList.add('oculto')
        vistaImagenesCat.classList.remove('oculto')
        // Carga las imágenes de esa categoría
        mostrarCategoria(categoria)
    })
})

//* Volver a la lista de categorías
btnVolverCategorias.addEventListener('click', () => {
    vistaImagenesCat.classList.add('oculto')
    vistaCategorias.classList.remove('oculto')
})

//? 6.1 CUSTOM — imágenes del usuario
// Máximo de imágenes permitidas
const MAX_CUSTOM = 21

// Carga y muestra las imágenes custom guardadas
async function cargarImagenesCustom() {
    const imagenes = await window.api.obtenerImagenesCustom()
    renderizarCustomGrid(imagenes)
}

// Renderiza el grid de custom
function renderizarCustomGrid(imagenes) {
    const customGrid = document.getElementById('customGrid')
    customGrid.innerHTML = ''

    // Botón +Agregar — solo si no llegó al límite
    if (imagenes.length < MAX_CUSTOM) {
        const btnAgregar = document.createElement('div')
        btnAgregar.classList.add('customItem', 'customAgregar')
        btnAgregar.innerHTML = `<i class="fa-solid fa-plus"></i><span>Agregar</span>`
        btnAgregar.addEventListener('click', async () => {
            // Abre el explorador de archivos
            const rutaOrigen = await window.api.seleccionarImagenCustom()
            if (!rutaOrigen) return
            // Guarda la imagen
            const nombre = await window.api.guardarImagenCustom(rutaOrigen)
            if (!nombre) return
            // Recarga el grid
            cargarImagenesCustom()
        })
        customGrid.appendChild(btnAgregar)
    }

    // Muestra cada imagen guardada
    imagenes.forEach(img => {
        const div = document.createElement('div')
        div.classList.add('customItem')

        // Marca como seleccionada si es la activa
        if (personaje === img.ruta) div.classList.add('selected')

        div.innerHTML = `
            <img src="${img.ruta}" alt="${img.nombre}">
            <button class="customEliminar" title="Eliminar">×</button>
        `

        // Selecciona la imagen al hacer clic
        div.addEventListener('click', (e) => {
            // Si hizo clic en la X no selecciona
            if (e.target.classList.contains('customEliminar')) return
            customGrid.querySelectorAll('.customItem').forEach(i => i.classList.remove('selected'))
            div.classList.add('selected')
            personaje = img.ruta
        })

        // Elimina la imagen al hacer clic en la X
        div.querySelector('.customEliminar').addEventListener('click', async () => {
            await window.api.eliminarImagenCustom(img.nombre)
            // Si era la seleccionada limpia el personaje
            if (personaje === img.ruta) personaje = null
            cargarImagenesCustom()
        })

        customGrid.appendChild(div)
    })
}

// Carga las imágenes al cambiar al tab Custom
tabCustom.addEventListener('click', () => {
    cargarImagenesCustom()
})


//? 6.2 GIF/STICKERS - Busqueda con API de Giphy
//* Referencias
const inputBuscarGif = document.getElementById('inputBuscarGif');
const gifGrid = document.getElementById('gifGrid');
const btnTabGif = document.getElementById('btnTabGif');
const btnTabSticker = document.getElementById('btnTabSticker');

//* Tipo de busqueda activo - gifs o stickers
let tipoGif = 'gifs';

//* Cambia entre GIF y Sticker
btnTabGif.addEventListener('click', ()=>{
	tipoGif = 'gifs';
	//Quita active del sticker y lo pone en gif
	btnTabSticker.classList.remove('active');
	btnTabGif.classList.add('active');

	//Si hay texto en el buscador relanza la busqueda
	if(inputBuscarGif.value.trim()) buscarGif(inputBuscarGif.value.trim());
})

btnTabSticker.addEventListener('click', ()=>{
	tipoGif = 'stickers';
	// Quita active del gif y lo pone en sticker
	btnTabGif.classList.remove('active');
	btnTabSticker.classList.add('active');
	// Si hay texto en el buscador relanza la búsqueda
    if (inputBuscarGif.value.trim()) buscarGif(inputBuscarGif.value.trim());
})

//* Busca cuando el usuario deja de escribir - espera 600ms
let timerBusqueda = null;
inputBuscarGif.addEventListener('input', ()=>{
	//Cancela la busqueda anterior si el usuario sigue escribiendo
	clearTimeout(timerBusqueda);
	const query = inputBuscarGif.value.trim();

	if(!query){
		//Si borra todo muestra el placeholder
		gifGrid.innerHTML = `
			<div class="gifPlaceholder">
				<i class="fa-solid fa-magnifying-glass"></i>
				<span>Buscar</span>
			</div>
		`;
		return;
	}

	//Espera 600ms antes de buscar para no llamar la API en cada letra
	timerBusqueda = setTimeout(()=> buscarGif(query), 600);
})

//* Funcion principal de busqueda
async function buscarGif(query){
	//Muestra loading mientras carga
	gifGrid.innerHTML =`
		<div class="gifPlaceholder">
			<i class="fa-solid fa-spinner fa-spin"></i>
			<span>Buscando...</span>	
		</div>
	`;

	try{
		// La búsqueda se hace desde main.js para evitar bloqueos de seguridad
		const datos = await window.api.buscarGiphy(query, tipoGif)

		//Si no hay resultados
		if(datos.data.length === 0){
			gifGrid.innerHTML = `
				<div class="gifPlaceholder">
					<i class="fa-solid fa-face-sad-tear"></i>
					<span>Sin resultados</span>
				</div>
			`;

			return;
		}

		//Limpia el grid y muestra los resultados
		gifGrid.innerHTML = '';
		datos.data.forEach(gif =>{
			const img = document.createElement('img');
			img.classList.add('gifItem');
			//Usa la version pequeña para cargar mas rapido
			img.src = gif.images.fixed_height_small.url;
			img.alt = gif.title;

			//Al hacer clic seleciona este gif
			img.addEventListener('click', ()=>{
				gifGrid.querySelectorAll('.gifItem').forEach(g => g.classList.remove('selected'));
				img.classList.add('selected');
				// Guarda la URL del gif como personaje
				personaje = gif.images.original.url;
			});

			gifGrid.appendChild(img);
		})

	}catch(error){
		//Si hay un error de red;
		gifGrid.innerHTML = `
			<div class="gifPlaceholder">
				<i class="fa-solid fa-wifi"></i>
				<span>Error de conexión</span>
			</div>
		`;
	}
}

//? 7. TIMER — lógica principal
//*Controla el inicio, pausa y detención del timer
//Guarda el momento exacto en que empezo el timer
let tiempoInicio = null;

// Inicia o reanuda el timer
btnIniciarPausar.addEventListener('click', ()=>{
if (!corriendo) {
        // Estaba pausado — calcula el nuevo inicio
        // restando los segundos que ya habian pasado
        corriendo = true
        tiempoInicio = Date.now() - ((segundosTotales - segundosRestantes) * 1000)

        intervalo = setInterval(() => {
            // Calcula cuántos segundos han pasado usando el reloj real del sistema
            const transcurrido = Math.floor((Date.now() - tiempoInicio) / 1000)
            // Resta del total para obtener los segundos restantes
            segundosRestantes = segundosTotales - transcurrido

			console.log('Segundos restantes:', segundosRestantes)
			
            // Actualiza el reloj visual
            actualizarReloj()

            // Si llegó a cero termina el ciclo
            if (segundosRestantes <= 0) terminarCiclo()
        }, 1000)

        // Cambia el botón a PAUSA
        btnIniciarPausar.innerHTML = '<i class="fa-solid fa-pause"></i> PAUSA'

    } else {
        // Estaba corriendo — pausa y guarda los segundos restantes actuales
        clearInterval(intervalo)
        corriendo = false
        intervalo = null
        tiempoInicio = null

        // Cambia el botón a INICIAR
        btnIniciarPausar.innerHTML = '<i class="fa-solid fa-play"></i> INICIAR'
    }
});

//* Funcion que se ejecuta cuando termina un ciclo
function terminarCiclo() {
    clearInterval(intervalo)
    corriendo = false
    intervalo = null

    if (!enDescanso) {
        // Termina concentración — siempre va a descanso primero
        enDescanso = true
        cicloActual++
        marcarCiclo(cicloActual)

        // Prepara el descanso
        estadoActual.textContent = 'Descanso'
        segundosRestantes = descanso * 60
        segundosTotales = descanso * 60

        // Abre el blocker siempre — incluso en el último ciclo
        window.api.abrirBlocker({
            personaje: personaje,
            segundos: descanso * 60,
			esUltimoCiclo: cicloActual >= ciclosTotales
        })

    } else {
        // Termina descanso — ahora verifica si completamos todos los ciclos
        if (cicloActual >= ciclosTotales) {
            //* Todos los ciclos completados incluyendo su descanso
            mostrarLogrado()
            return
        }

        // Si hay más ciclos vuelve a concentración
        enDescanso = false
        estadoActual.textContent = 'Concentración'
        segundosRestantes = concentracion * 60
        segundosTotales = concentracion * 60
    }

    actualizarReloj()
}

// BOTÓN TEMPORAL — salta directo al descanso para testear
document.getElementById('btnSkip').addEventListener('click', () => {
    terminarCiclo()
})

//? 8. CICLOS — cuadraditos y progreso
//* Genera los cuadritos de ciclos según la configuración
function generarCiclos() {
	//Limpia los cuadritos anteriores
	ciclosRow.innerHTML = '';

	//Crea un cuadritos por cada ciclo configurado
	for(let i=0; i < ciclosTotales; i++){
		const cuadrado = document.createElement('div')
		cuadrado.classList.add('cicloCuadrado')
		cuadrado.id = `ciclo-${i}` // ID unico para poder marcarlo despues
		ciclosRow.appendChild(cuadrado)
	}
}

//* Marca un cuadradito como completo:
function marcarCiclo(numero) {
	//Busca el cuadradito por su ID y le agrega la clase done
	const cuadrado = document.getElementById(`ciclo-${numero -1}`);
	if(cuadrado) cuadrado.classList.add('done')
}

//*Actualiza el reloj circular segun el progreso
function actualizarReloj() {
	//Calcula que porcentaje del tiempo ha pasado
	const progreso = 1 - (segundosRestantes / segundosTotales);

	//La circunferencia del circulo SVG es 295.3
	const circuferencia = 502.6

	//A mayor progreso, menor offset - asi el circulo se llena
	const offSet = circuferencia - (progreso * circuferencia);
	ringProgress.style.strokeDashoffset = offSet;
}

//*Muestra la pantalla de logrado al completar todos lo ciclos
function mostrarLogrado() {
	//Por ahroa solo muestra un mensaje - aqui era la animacion despues
	estadoActual.textContent = '¡LOGRADO!'
	cicloActual = 0;
}

//? 9. INICIALIZACIÓN — arranque de la app
//* Carga la configuracion guardada al abrir la app
async function inicializar() {
	//Pide la config guardada a main.js a traves del preload
	const config = await window.api.cargarConfig()

	//Aplica los valores guardados a las variables globales
	concentracion = config.concentracion
	descanso = config.descanso
	ciclosTotales = config.ciclosTotales
	personaje = config.personaje
	modoOscuro = config.modoOscuro || false 

	//Aplica el modo guardado al arrancar
	document.body.classList.toggle('dark', modoOscuro)
	const iconoClase = modoOscuro ? 'fa-sun' : 'fa-moon'
	iconoModo.className = `fa-regular ${iconoClase}`
	iconoModo2.className = `fa-regular ${iconoClase}`

	//Actualiza los sliders con los valores guardados
	sliderConcentracion.value = concentracion
	sliderDescanso.value = descanso
	sliderCiclos.value = ciclosTotales

	//Actualiza los inputs numericos con los valores guardados
	valConcentracion.value = concentracion
	valDescanso.value = descanso
	valCiclos.value = ciclosTotales

	//Calcula el total con los valores cargados
	calcularTotal()
}

//* Cuando completa todos los ciclos vuelve a la vista settings
window.api.volverASettings(() => {
    // Detiene cualquier timer activo
    clearInterval(intervalo)
    corriendo = false
    intervalo = null
    cicloActual = 0
    enDescanso = false

    // Muestra settings y oculta timer
    vistaTimer.classList.add('oculto')
    vistaSettings.classList.remove('oculto')
})

//* Arranca la inicializacion
inicializar();