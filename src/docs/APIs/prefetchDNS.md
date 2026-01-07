¡Perfecto! Ya vimos el "apretón de manos completo" (`preconnect`). Ahora veamos a su hermano pequeño y ligero: **`prefetchDNS`**.

Es la herramienta de **"Especulación de bajo costo"**. 🕵️‍♂️

---

### 1. ¿Qué es `prefetchDNS`?

Si `preconnect` es llamar a un amigo y esperar a que conteste para tener la línea abierta...
**`prefetchDNS` es solo buscar su número en la guía telefónica.**

Solo hace el **Paso 1** de la conexión: **DNS Lookup** (Traducir `google.com` a `142.250.189.46`).

- **Costo para el navegador:** Muy bajo (casi gratis en recursos).
- **Tiempo que ahorra:** Entre 20ms y 100ms (dependiendo de la red).

---

### 2. ¿Cuándo usarlo? (La estrategia de la "Duda") 🤔

Aquí está la clave para diferenciarlo de `preconnect`:

Úsalo cuando **NO estás seguro** de si el usuario va a necesitar ese recurso, pero hay una probabilidad decente.

- **Enlaces a Redes Sociales:** El usuario _podría_ hacer clic en tu Instagram o Twitter, pero no es seguro. Hacemos `prefetchDNS` para que, si hace clic, cargue un pelín más rápido.
- **Enlaces de "Leer más":** Si tienes artículos relacionados que llevan a otro dominio.
- **Herramientas de Analytics secundarias:** Que quizás se carguen solo si el usuario hace scroll hasta el final.

### 3. Ejemplo en Código

React 19 nos permite invocar esto directamente en el componente donde están los enlaces.

```jsx
import { prefetchDNS } from "react-dom";

export default function Footer() {
  // ESTRATEGIA:
  // No sabemos si el usuario irá a Twitter o GitHub,
  // pero buscamos las IPs por si acaso. Es barato.
  prefetchDNS("https://twitter.com");
  prefetchDNS("https://github.com");

  return (
    <footer className="p-10 bg-gray-900 text-white">
      <h3>Síguenos</h3>
      <div className="flex gap-4">
        <a href="https://twitter.com/mi_app">Twitter</a>
        <a href="https://github.com/mi_app">GitHub</a>
      </div>
    </footer>
  );
}
```

---

### 4. Diferencias Clave (Tabla Resumen)

| Característica        | `preconnect` 🤝                                                                  | `prefetchDNS` 🔍                                                   |
| --------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| **Qué hace**          | DNS + Conexión TCP + Encriptación SSL.                                           | Solo búsqueda DNS (IP).                                            |
| **Costo CPU/Batería** | Alto ⚠️ (Mantiene una conexión abierta).                                         | Mínimo ✅.                                                         |
| **Certeza requerida** | **Alta**: Úsalo si sabes que VAS a descargar algo (Fuentes, API).                | **Media/Baja**: Úsalo para enlaces externos o navegación probable. |
| **Riesgo**            | Si no usas la conexión en 10s, el navegador la cierra y desperdiciaste recursos. | Ninguno. La IP queda en caché del sistema operativo un rato.       |

### En resumen

- Usa **`preconnect`** para lo que **necesitas** (API, CDN, Fuentes).
- Usa **`prefetchDNS`** para lo que **podría pasar** (Enlaces salientes).
