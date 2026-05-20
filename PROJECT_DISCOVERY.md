# PROJECT DISCOVERY - POMODORO APP

## Problema que resuelve
Personas con dificultad de concentración o TDHA necesitan una herramienta que no solo mida el tiempo, sino físicamente impoda la distracción durante el descanso.

## Usuario objetivo
Personas en escritorio Windows que trabaja o estudia y necesita estructura de concentración.

## Diferenciador
Bloqueo total de interacción en descanso +  animación de personajes pixel art encima de todo el escritorio.

---

## Estados de la aplicación

| Estado | Timer | Desktop | Animación | Bloqueo |
|---|---|---|---|---|
| Concentración | Corre (app cerrada también) | Libre | Ninguna | No |
| Pausa | Detenido | Libre | Ninguna | No |
| Descanso corto | Cuenta regresiva | Bloqueado | Pixel art caminando | Sí |
| Descanso largo | Cuenta regresiva | Bloqueado | Pixel art caminando | Sí |
| Ciclo completo | - | Libre | Imagen "Logrado" breve | No |

---

## Configuración guardable

| Parámetro | Default |
|---|---|
| Tiempo de concentración | 30 min |
| Tiempo de descanso corto | 5 min |
| Tiempo de descanso largo | 10 min |
| Ciclos antes del descanso largo | 4 |

---

## Stack tecnológico

| Herramienta | Rol |
|---|---|
| Electron | Motor de la app de escritorio |
| HTML + CSS + JS | Interfaz y lógica |
| Electron Builder | Empaquetado final en .exe |
| Node.js | Requerido por Electron |
| VSCode | Editor |

## Assets MVP
Imágenes de gatos o perros como placeholder.
Sprites pixel art propios en versiones futuras.