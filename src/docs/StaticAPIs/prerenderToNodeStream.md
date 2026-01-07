Para completar tu sección de **Static APIs**, cerramos con **`prerenderToNodeStream`**.

Esta API es la versión técnica y orientada a flujos de datos (streams) de la que acabamos de ver. Mientras que `prerender` es más genérica, esta está diseñada específicamente para integrarse con los servidores de **Node.js**.

---

### 1. ¿Qué es `prerenderToNodeStream`?

Es una función que renderiza un árbol de React a un **Node.js Writable Stream**. Al igual que `prerender`, su característica principal es que **espera a que todo el contenido esté cargado** (incluyendo datos asíncronos y Suspense) antes de dar por terminada la transmisión.

### 2. ¿En qué se diferencia de `prerender`?

La diferencia no es _qué_ hace, sino _cómo_ entrega el resultado:

- **`prerender`**: Te devuelve una Promesa que resuelve a un objeto con el contenido. Es más moderna y agnóstica al entorno.
- **`prerenderToNodeStream`**: Está hecha para el ecosistema clásico de Node.js. Te permite "tuberizar" (pipe) el resultado directamente a la respuesta del servidor (`res`) o a un archivo.

### 3. ¿Por qué es importante en el ecosistema actual?

Aunque estés usando **Vite**, entender esto te ayuda a comprender cómo se generan los sitios estáticos hoy en día:

1. **Cero Hydration Mismatch:** Al esperar a que todo esté listo, el HTML generado es idéntico al que React espera encontrar, evitando errores al cargar.
2. **SEO de Élite:** Los buscadores reciben un flujo de datos completo y estructurado, no una página vacía que depende de JS.
3. **Compatibilidad:** Es la API que usan los scripts de "build" de herramientas que generan sitios estáticos basados en Node.js.

### 4. Ejemplo Conceptual (Uso en un Script de Servidor)

Tú no verás esto en tu código de `src/`, sino en los scripts que preparan tu app para producción:

```javascript
import { prerenderToNodeStream } from "react-dom/static";
import fs from "node:fs";

async function buildStaticPage() {
  // Creamos un archivo físico donde guardaremos el HTML
  const writeStream = fs.createWriteStream("./dist/index.html");

  // Prerenderizamos la App
  const { prelude } = await prerenderToNodeStream(<App />);

  // Enviamos el resultado directamente al archivo
  prelude.pipe(writeStream);
}
```

---

### Resumen de las Static APIs para tu Documentación

| API                         | Entorno                     | Formato de Salida               |
| --------------------------- | --------------------------- | ------------------------------- |
| **`prerender`**             | Universal (Node, Bun, Edge) | Readable Stream (Web Standard)  |
| **`prerenderToNodeStream`** | Node.js                     | Writable Stream (Node Standard) |

---
