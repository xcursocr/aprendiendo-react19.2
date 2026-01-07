APIs de React DOM: las **Static APIs**.

Tal como sospechábamos, estas APIs son el puente entre el mundo de **Vite** (lado del cliente) y el mundo de los **Frameworks** o entornos de servidor (Node.js, Bun, Edge). Sin embargo, es vital entenderlas porque explican cómo React 19 logra ser tan rápido en la carga inicial.

---

## `prerender`

`prerender` es una de las adiciones más potentes de **React 19**. A diferencia de las APIs de "Streaming" que envían la página por trozos, `prerender` espera a que **toda** la página esté lista para entregar un HTML estático completo.

### 1. ¿Qué es exactamente?

Imagina que tienes una página que carga datos de una API.

- **Con Streaming:** El servidor envía el encabezado, luego espera los datos, y luego envía el contenido.
- **Con `prerender`:** El servidor genera toda la página en memoria, espera a que todas las promesas y datos se resuelvan, y cuando el HTML está "perfecto" y completo, lo entrega.

### 2. ¿Para qué sirve en tu flujo de trabajo?

Aunque en un proyecto de **Vite** estándar no ejecutas `prerender` (porque Vite es un servidor de desarrollo estático), esta API es la que usan las herramientas de **Generación de Sitios Estáticos (SSG)**.

Si en algún momento decides convertir tu app de Vite en una web estática que vuele en Google (SEO perfecto), usarías una herramienta que llame a `prerender` por detrás para generar los archivos `.html` de cada ruta.

---

### 3. Diferencias con sus hermanos (Streaming)

React 19 separa las APIs según cómo quieres entregar el contenido:

| API                          | Comportamiento                                          | Uso ideal                                  |
| ---------------------------- | ------------------------------------------------------- | ------------------------------------------ |
| **`renderToPipeableStream`** | Envía HTML por trozos mientras carga.                   | Aplicaciones dinámicas (Dashboard).        |
| **`prerender`**              | Espera a que todo esté listo y entrega el bloque final. | **Generación Estática (Blogs, Landings)**. |

---

### 4. ¿Cómo se ve en código? (Contexto de Servidor)

Aunque esto se ejecuta en Node.js, así es como funciona la lógica:

```javascript
import { prerender } from "react-dom/static";

async function generarHtmlEstatico() {
  // prerender es una función asíncrona
  const { prelude } = await prerender(<App />);

  // 'prelude' es un stream que contiene todo el HTML ya resuelto
  // No hay "Suspense" pendiente, todo está renderizado.
  return prelude;
}
```

---

### 5. ¿Debes incluirlo en tu Starter Kit de Vite? 🛠️

**La respuesta es: No como código vivo, pero sí como concepto.**

En Vite, tu "prerenderizado" suele ocurrir manualmente (tú escribes el HTML base y React se monta encima). Pero si alguna vez usas un plugin de Vite para SSG (como `vite-plugin-ssr`), ese plugin estará usando `prerender` por debajo.

**Puntos clave para tu documentación:**

- **Consistencia:** `prerender` garantiza que lo que ve el bot de Google es exactamente lo mismo que verá el usuario.
- **Finalidad:** Es el sustituto moderno de `renderToString` para aplicaciones que usan Suspense.
- **React 19:** Esta API está optimizada para trabajar con los nuevos componentes de metadatos (`<title>`, `<meta>`) que ya estudiamos.

---
