# DEVELOPMENT LOG -- POMODORO APP

---

## Sesión 1 -- [12-05-26]
- Fase de Discovery completada
- Fase de Planificación completada
- Entorno de desarrollo configurado
- main.js creado y comentado
- timer.html creado con estructura base
- npm start ejecutado exitosamente
- Primera ventana de la app visible y funcionando

### Decisiones tomadas
- Stacks definido: Electron + HTML + CSS + JS
- Estructura de carpetas creada manualmente.
- package.json generado y configurado con npm init -y.
- Electron instalado como dependencia de desarrollo
Comando de arranque configurado: npm start
- settings.html eliminado como archivo separado
- timer.html tendrá dos vistas: settings (primera) y timer (segunda)
- El JS controla qué vista se muestra, sin abrir ventanas nuevas
- Eliminados: settings.css y settings.js
- Estilo visual definido: retro LCD
- Flujo de la app: settings → timer → bloqueo → logrado

### Archivos eliminados
- src/windows/settings.html
- src/css/settings.css
- src/js/settings.js

### Estado actual
- Estructura de archivos actualizada
- Próximo paso: boceto y código del settings con estilo retro LCD

### Corrección de estados
- Descanso corto y descanso largo tienen el mismo comportamiento:
Bloqueo total + animacion pixel art. La unica diferencia es la duración.

---

## Sesión 2 -- [13-05-26]
- timer.html completado con dos vistas: settings y timer
- timer.css completado con variables de modo claro/oscuro
- FontAwesome integrado para iconos
- Ventana configurada sin barra de menú y sin frame
- TopBar arrastrable con -webkit-app-region
- Tamaño de ventana definido: 420px ancho

### Decisiones tomadas
- CSS Nesting descartado por ahora, se mantiene CSS plano con comentarios
- camelCase en todas las clases e IDs
- paramVal cambiado de span a input type number para sincronizar con slider
- iconoModo e iconoModo2 con ID propio para que JS cambie luna/sol
- frame: false en main.js para ocultar controles del sistema operativo
- Botón de cerrar propio agregado en topBar

### Estado actual
- Estructura visual completa
- Siguiente paso: timer.js con toda la lógica de la app

---

## Sesión 3 — [14-05-26]

### ¿Qué se hizo?
- timer.js completado con todas las secciones
- Corregidos errores de tipeo en calcularTotal y terminarCiclo
- sincronizarSlider corregido — ahora usa funciones directas en vez de window[variable]
- Botón iniciar y pausa unificado en uno solo (btnIniciarPausar)
- Timer arranca automáticamente al presionar EMPEZAR
- Círculo SVG agrandado a 180px
- Botón de cerrar eliminado — se usa la X de Windows
- btnCerrar eliminado del HTML y JS

### Decisiones tomadas
- frame visible por ahora — se evalúa quitar al final
- btnCerrar descartado — la X de Windows es suficiente
- Timer arranca solo al presionar EMPEZAR sin necesitar INICIAR

### Estado actual
- Vista settings funcional
- Vista timer funcional con reloj circular animado
- Sliders sincronizados con inputs numéricos
- Total de sesión calculado en tiempo real

---

## Sesión 4 — [15-05-26]

### ¿Qué se hizo?
- preload.js conectado correctamente con main.js
- Persistencia de configuración funcionando con user-settings.json
- Modo claro/oscuro guardado y restaurado al abrir la app
- Timer arranca automáticamente al presionar EMPEZAR
- Funcionalidad core del timer completa

### Decisiones tomadas
- Personajes cambiados de categorías a animales concretos:
  Gato, Perro y Capibara
- blocker.html tendrá fondo transparente sobre todo el escritorio
- Contador de descanso visible encima del animal animado

### Pendiente para próxima sesión
- Cambiar opciones de personaje en timer.html
- Conseguir sprites pixel art de gato, perro y capibara
- Crear blocker.html con fondo transparente
- Conectar el fin del ciclo de concentración con el blocker

---

## Sesión 5 - [17-05-26]

### ¿Qué se hizo?
- blocker.html, blocker.css y blocker.js completados
- Imagen del animal se muestra correctamente en el blocker
- Tiempo de descanso visible en esquina inferior derecha de la imagen
- Tecla ESC para desbloquear en emergencia
- Cursor not-allowed durante el bloqueo
- Alt+tab resuelto con setAlwaysOnTop screen-saver
- Timer corregido con Date.now() — funciona minimizado
- terminarCiclo corregido — descanso ocurre siempre antes de LOGRADO
- App renombrada a NapGuard
- Electron Builder instalado y package.json configurado

### Decisión de nombre
App renombrada de PomoFox a NapGuard
Razón: nombre con identidad propia — el guardián del descanso

### Pendiente para próxima sesión
- Agregar icono .ico a la app
- Empaquetar con npm run build
- Generar instalador .exe

--- 

## Sesión 6 - [18-05-26]

###