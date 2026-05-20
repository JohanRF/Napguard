//? 1. VARIABLES GLOBALES
//Configuracion del usuario:
let concentracion = 30 // min de concentracion
let descanso = 5 // min de descanso corto
let ciclosTotales = 4 // cantidad de ciclos totales
let personaje = 'domesticos'
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

//? 6. PERSONAJES — selección
//* Guardar que personaje eligio el usuario
// Selecciona todos los elementos de opcion de personaje
const opcionesPersonaje = document.querySelectorAll('.personajeOpt');

opcionesPersonaje.forEach(opcion =>{
	opcion.addEventListener('click', ()=>{
		//Quita la seleccion de todas las opciones 
		opcionesPersonaje.forEach(o =>{
			o.classList.remove('selected');
			o.querySelector('.radioDot').classList.remove('filled');
		})

		//Marca como seleccionada la opcion que todo el usuario
		opcion.classList.add('selected');
		opcion.querySelector('.radioDot').classList.add('filled');

		//Guarda el personaje elegido en la variable global.
		personaje = opcion.dataset.personaje
	})
})

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

	//Marca el personaje guardado como seleccionado
	opcionesPersonaje.forEach(opcion =>{
		if (opcion.dataset.personaje === personaje) {
			opcion.classList.add('selected')
			opcion.querySelector('.radioDot').classList.add('filled')
		}else{
			opcion.classList.remove('selected')
			opcion.querySelector('.radioDot').classList.remove('filled')
		}
	})

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