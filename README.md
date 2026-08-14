# NapGuard — bloqueo real para tus descansos

App de escritorio para Windows con técnica Pomodoro, pensada para personas con dificultad para mantener el enfoque (incluyendo TDAH). A diferencia de un temporizador común, **bloquea físicamente la interacción con el escritorio durante los descansos**, forzando una desconexión real en vez de depender de la fuerza de voluntad.

## 🔗 Ver landing page
[johanrf.github.io/Napguard](https://johanrf.github.io/Napguard/)

## 📋 Cómo funciona

| Estado | Timer | Escritorio | Pantalla de descanso |
|---|---|---|---|
| Concentración | Corre | Libre | — |
| Descanso corto/largo | Cuenta regresiva | Bloqueado | Imagen/GIF/video personalizable |
| Ciclo completo | — | Libre | Notificación en esquina inferior derecha |

Tiempos configurables (default: 30 min concentración, 5 min descanso corto, 10 min descanso largo, 4 ciclos antes del descanso largo).

## 🎨 Personalización de la pantalla de descanso
- El usuario elige su propia imagen, GIF o video de fondo
- Ajustable: posición del contenido, color de fondo, font-family
- Incluye una pequeña animación de ida y vuelta entre 2 variantes simples, además de la imagen personalizada

## 🛠️ Stack
- Electron (motor de app de escritorio)
- HTML + CSS + JavaScript
- Node.js

## 🚀 Cómo correrlo localmente
\`\`\`bash
git clone https://github.com/JohanRF/Napguard.git
cd Napguard
npm install
npm start
\`\`\`

## 🧠 Reto principal
Aprender desde cero la arquitectura de procesos de Electron: cómo `main.js` (proceso principal, habla con Windows), `preload.js` (puente seguro) y las ventanas HTML (renderer, lo que ve el usuario) se comunican entre sí sin que el renderer acceda directo al sistema.

## 📁 Documentación del proceso
Este proyecto está documentado desde su concepción, no solo el código:
- [`PROJECT_DISCOVERY.md`](./PROJECT_DISCOVERY.md) — problema que resuelve, usuario objetivo, decisiones de producto
- [`PROJECT_STRUCTURE.md`](./PROJECT_STRUCTURE.md) — mapa completo de archivos y arquitectura
- [`DEVELOPMENT.md`](./DEVELOPMENT.md) — bitácora de desarrollo sesión por sesión

## 📌 Estado del proyecto
En pausa — completado: estructura base, ventana de configuración y timer funcional. La pantalla de bloqueo actual muestra una imagen y tiempo predeterminados. Pendiente: sistema de personalización (imagen/GIF/video propio, posición, color de fondo, font-family) y animación simple entre variantes.