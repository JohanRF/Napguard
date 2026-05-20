# PROJECT STRUCTURE — POMODORO APP

## ¿Qué es este documento?
El mapa del proyecto. Explica qué hace cada archivo y por qué existe.
Consultar cuando se retome el proyecto o algo no tenga sentido.

---

## Estructura de carpetas
POMODORO/
│
├── PROJECT_DISCOVERY.md        → Contexto y decisiones del proyecto
├── PROJECT_STRUCTURE.md        → Este archivo. Mapa del proyecto
├── package.json                → Identidad de la app para Node y Electron
├── main.js                     → Cerebro. Habla con Windows. Controla todo
├── preload.js                  → Puente seguro entre main.js y las ventanas
│
├── /src
│   ├── /windows
│   │   ├── timer.html          → Dos vistas: Setting(primera) y timer(segunda) el js controla cual se muestra
│   │   ├── blocker.html        → Pantalla de bloqueo durante el descanso
│   │
│   ├── /css
│   │   ├── timer.css           → Estilos de la ventana timer
│   │   ├── blocker.css         → Estilos de la pantalla de bloqueo
│   │
│   ├── /js
│   │   ├── timer.js            → Lógica visual del timer
│   │   ├── blocker.js          → Lógica de animación pixel art
│   │
│   └── /assets
│       ├── /images             → Imagen "Logrado", gatos, perros, íconos
│       └── /sounds             → Sonidos de notificación (versiones futuras)
│
└── /config
└── user-settings.json      → Tiempos configurados por el usuario

---

## Relación entre archivos clave

main.js controla el timer y las ventanas
preload.js lleva mensajes entre main.js y el HTML
Cada ventana HTML tiene su CSS y JS con el mismo nombre
user-settings.json guarda y carga la configuración del usuario

---

## Concepto clave — Los 3 procesos de Electron

MAIN PROCESS (main.js)
→ Corre en Node.js
→ Habla con Windows directamente
→ Controla ventanas, timer persistente, archivos

PRELOAD (preload.js)
→ Es el puente seguro
→ Pasa mensajes en ambas direcciones
→ No tiene lógica propia

RENDERER PROCESS (los HTML)
→ Es lo que el usuario ve
→ HTML + CSS + JS normal
→ No puede hablar con Windows directamente