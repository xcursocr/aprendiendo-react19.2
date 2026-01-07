¡Entramos a la sección de **Velocidad y Performance**! 🏎️💨

Aquí es donde React 19 te da herramientas para que tu aplicación cargue más rápido, anticipándose a lo que el navegador va a necesitar.

Empezamos con **`preconnect`** (y su hermano menor `prefetchDNS`), que son parte de los llamados **Resource Hints** (Pistas de Recursos).

---

### `preconnect`: El "Apretón de Manos" Anticipado 🤝

Cuando tu navegador necesita pedir un recurso a un servidor externo (por ejemplo, una fuente de Google Fonts o una imagen de Amazon S3), tiene que hacer un ritual costoso antes de descargar el primer byte.

Este ritual se llama **Handshake** y tiene 3 pasos:

1. **DNS Lookup:** Buscar la dirección IP (¿Dónde vive `api.miservidor.com`?).
2. **TCP Handshake:** Establecer la conexión.
3. **TLS Negotiation:** Encriptar la conexión (HTTPS).

Esto puede tomar cientos de milisegundos.

**¿Qué hace `preconnect`?**
Le dice al navegador: _"Oye, sé que en un rato voy a pedir algo a `https://api.stripe.com`, así que ve haciendo el saludo (DNS+TCP+TLS) AHORA, en segundo plano, para que cuando pida los datos, la tubería ya esté abierta"._

---

### ¿Cómo se usa en React 19?

Antes tenías que poner `<link rel="preconnect" ...>` manualmente en el HTML.
Ahora, React te da una función imperativa en `react-dom` que puedes llamar **dentro de tus componentes**.

React es inteligente: si 10 componentes llaman a `preconnect` para el mismo sitio, React **Deduplica** la orden y solo le avisa al navegador una vez.

#### Ejemplo Práctico: Google Fonts 🎨

Google Fonts es el ejemplo clásico. Necesitas conectarte a `fonts.gstatic.com` para bajar los archivos de fuente.

```jsx
import { preconnect } from "react-dom";

function MiLandingPage() {
  // 1. LE AVISAMOS AL NAVEGADOR
  // Esto no descarga nada todavía, solo abre la "tubería".
  // Lo hacemos durante el renderizado (es seguro en React 19).
  preconnect("https://fonts.gstatic.com");

  return (
    <div className="landing">
      <h1>Bienvenidos</h1>
      {/* ... más contenido ... */}
    </div>
  );
}
```

---

### `prefetchDNS`: El "Hermano Menor" 🔍

En tu lista también aparece `prefetchDNS`. Es una versión más ligera de `preconnect`.

- **`preconnect`**: Hace TODO (DNS + TCP + TLS). Es costoso para el navegador, así que úsalo solo para dominios que usarás **seguro** y **pronto** (ej: tu API principal, CDN de imágenes).
- **`prefetchDNS`**: Solo busca la IP (Paso 1). Es muy barato. Úsalo si _crees_ que el usuario podría ir a un enlace externo, pero no estás seguro.

**Ejemplo:**

```jsx
import { prefetchDNS } from "react-dom";

function ListaEnlaces() {
  // El usuario quizás haga clic, quizás no. Solo buscamos la IP por si acaso.
  prefetchDNS("https://sitio-externo.com");

  return <a href="https://sitio-externo.com">Ir al sitio</a>;
}
```

---

### Resumen Rápido

| API               | ¿Qué hace?                                  | Costo CPU/Red | ¿Cuándo usarlo?                                        |
| ----------------- | ------------------------------------------- | ------------- | ------------------------------------------------------ |
| **`preconnect`**  | Prepara la conexión completa (DNS+TCP+TLS). | Alto ⚠️       | Para tu API principal o CDNs críticas que usarás YA.   |
| **`prefetchDNS`** | Solo busca la IP.                           | Bajo ✅       | Para enlaces externos que el usuario _podría_ visitar. |

**Nota de React 19:**
Lo genial de estas APIs (`ReactDOM.preconnect`) es que puedes ponerlas justo al lado del código que necesita ese recurso. No tienes que ir a editar un archivo `index.html` lejano. Mantienes tu componente autocontenido.
