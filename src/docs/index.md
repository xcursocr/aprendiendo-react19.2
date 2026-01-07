**La gran mayoría se aplica a Vite, pero las "Server APIs" son el motor de frameworks como Next.js.**

Aquí tienes el desglose para que decidas qué documentar ahora mismo:

---

### 1. Client APIs (`createRoot`, `hydrateRoot`)

- **Vite:** Usas `createRoot` obligatoriamente en tu archivo `main.jsx`. Es el punto de partida de toda SPA (Single Page Application).
- **Frameworks (Next.js):** Ellos usan `hydrateRoot` por debajo para que el HTML que viene del servidor se vuelva interactivo.
- **Veredicto:** **Documenta `createRoot**`. Es vital para tu Starter Kit.

### 2. APIs de Recursos (`preconnect`, `preload`, `preinit`, etc.)

- **Vite:** ¡Absolutamente sí! Son una de las mejores novedades de React 19 para aplicaciones puras de cliente. Te permiten optimizar la carga de fuentes y scripts externos directamente desde tus componentes sin tocar el HTML.
- **Veredicto:** **Documenta todas**. Son "joyas" de rendimiento para cualquier proyecto.

### 3. Server APIs (`renderToPipeableStream`, `renderToString`, etc.)

- **Vite:** **No las usas directamente.** Estas funciones sirven para convertir componentes de React en HTML (strings o streams) dentro de un entorno de Node.js o Edge.
- **Frameworks:** Next.js, Remix o Astro viven de estas APIs.
- **Veredicto:** **Puedes saltártelas por ahora.** A menos que quieras construir tu propio framework desde cero, no las tocarás en un proyecto estándar de Vite.

### 4. Directivas (`"use client"`, `"use server"`)

- **Vite:** Por defecto, Vite no las reconoce (necesitarías plugins especiales). Todo en Vite es, por definición, "client".
- **Frameworks:** Son fundamentales en Next.js para separar qué se ejecuta en el servidor y qué en el navegador.
- **Veredicto:** **Déjalas para cuando aprendas Next.js.**

---

### ¿Cómo seguimos?

Viendo tu lista, lo que **te falta para completar el dominio de React en el lado del cliente (Vite)** es:

1. **Static APIs:** Específicamente `prerender` y `prerenderToNodeStream` (aunque son más para generación estática, es bueno saber qué son).
2. **React Compiler:** Esto es el futuro. Es una herramienta que automatiza el uso de `useMemo` y `useCallback`. **Vale mucho la pena documentar qué es y cómo se configura.**

**¿Te gustaría que empezáramos con el React Compiler para que sepas cómo va a cambiar la forma en que escribimos código optimizado?** Es el tema del momento.
