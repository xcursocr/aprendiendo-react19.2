**SEO y los Metadatos**.

Si alguna vez has tenido que lidiar con SEO en React, sabes que era un dolor de cabeza. React renderiza en el `<body>`, pero Google y las redes sociales buscan la información en el `<head>`.

Hasta ahora, la solución estándar era instalar una librería extra llamada `react-helmet`. En **React 19**, esa librería se vuelve obsoleta. React ahora tiene **superpoderes nativos** para esto.

---

### 1. El Concepto Mágico: "Hoisting" (Elevación) 🏗️

React 19 introduce algo llamado "Hoisting" para las etiquetas de metadatos (`<title>`, `<meta>`, `<link>`).

**¿Qué significa?**
Significa que puedes escribir estas etiquetas **donde quieras** (en un componente hijo, nieto, o dentro de un `if`), y React automáticamente las "arrancará" de ahí y las colocará ordenadamente en la sección `<head>` de tu documento HTML final.

---

### 2. Adiós `react-helmet`, Hola React Nativo 👋

#### ❌ Antes (React 18 + Librerías)

Tenías que importar una librería, envolver cosas, y rezar para que no hubiera conflictos.

```jsx
// CÓDIGO VIEJO (NO COPIAR)
import { Helmet } from "react-helmet"; // Dependencia externa

function PaginaProducto({ producto }) {
  return (
    <>
      <Helmet>
        <title>{producto.nombre}</title>
        <meta name="description" content={producto.desc} />
      </Helmet>
      <h1>{producto.nombre}</h1>
    </>
  );
}
```

#### ✅ Ahora (React 19)

Es HTML puro y duro. React hace el trabajo sucio.

```jsx
// CÓDIGO NUEVO (Nativo)
function PaginaProducto({ producto }) {
  return (
    <>
      {/* React detecta esto y lo mueve al <head> automáticamente */}
      <title>{producto.nombre} | Mi Tienda</title>
      <meta name="description" content={producto.descripcion} />
      <meta property="og:image" content={producto.imagenUrl} />
      <link rel="canonical" href={`https://tienda.com/${producto.slug}`} />

      {/* El resto se queda en el body */}
      <h1>{producto.nombre}</h1>
    </>
  );
}
```

---

### 3. Ejemplo Práctico: Componente `SEO` Reutilizable 🧩

Para tu **Starter Kit**, en lugar de repetir estas etiquetas en cada página, vamos a crear un componente reutilizable. Esto es una "Best Practice".

Crea un archivo `components/SeoHead.jsx`:

```jsx
export default function SeoHead({ title, description, image, url }) {
  return (
    <>
      {/* 1. Título de la pestaña */}
      <title>
        {title ? `${title} | Aprendiendo React` : "Aprendiendo React"}
      </title>

      {/* 2. Meta etiquetas básicas */}
      <meta
        name="description"
        content={description || "Sitio de aprendizaje de React 19"}
      />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* 3. Open Graph (Para cuando compartes en Facebook/WhatsApp/LinkedIn) */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {image && <meta property="og:image" content={image} />}

      {/* 4. Canonical URL (Para evitar contenido duplicado en Google) */}
      {url && <link rel="canonical" href={url} />}
    </>
  );
}
```

**Y así lo usas en tus páginas:**

```jsx
import SeoHead from "./components/SeoHead";

export default function PaginaContacto() {
  return (
    <div className="p-10">
      <SeoHead
        title="Contáctanos"
        description="Ponte en contacto con nuestro equipo de soporte."
      />

      <h1>Formulario de Contacto</h1>
      {/* ... tu formulario ... */}
    </div>
  );
}
```

---

### 4. Detalles Importantes 🔍

1. **Prioridad (El último gana):**
   Si tienes un `<title>` en tu componente `App` (Layout) que dice "Mi App", y luego otro `<title>` en tu página `Contacto` que dice "Contacto", React sabrá que debe mostrar el de "Contacto" porque se renderizó después (o más profundo en el árbol).
   _Nota: Esto funciona perfecto para `<title>` y `<meta name="...">`. Para otros tags, a veces se duplican si no tienes cuidado, pero React intenta ser inteligente._
2. **Server-Side Rendering (SSR):**
   Si en el futuro mueves esto a Next.js o Remix, esta funcionalidad es vital. Permite que cuando el bot de Google visite tu página, vea el título y la descripción correctos **antes** de ejecutar JavaScript, lo cual dispara tu ranking SEO.
3. **No abusar:**
   Aunque puedes poner `<title>` en cualquier lado, intenta mantenerlo organizado (como en el componente `SeoHead` que hicimos). No escondas un `<title>` dentro de un botón, por ejemplo, porque será difícil de mantener para ti.

---

### Resumen de la Sección

- **`<title>`, `<meta>`, `<link>**` ahora son componentes de primera clase en React.
- Se **elevan (hoisting)** automáticamente al `<head>`.
- No necesitas librerías externas.

Con esto cubrimos el **Bronce** de nuestra lista. Nos quedan los de **Carga de Recursos (`<style>`, `<script>`)** que son interesantes pero más técnicos, y el cambio en `ref`.
