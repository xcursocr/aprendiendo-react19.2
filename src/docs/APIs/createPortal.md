Dejamos atrás los componentes visuales (HTML) y entramos al "cuarto de máquinas" de React con las **DOM APIs**.

Esta sección es interesante porque, según la imagen que me compartiste, tenemos dos tipos de herramientas:

1. **Herramientas de Lógica:** `createPortal` y `flushSync`.
2. **Herramientas de Rendimiento (Resource Hints):** Todas las demás (`preconnect`, `preload`, etc.), que son nuevas o mejoradas en React 19.

Empecemos con el más visual y útil de todos: **`createPortal`**.

---

### `createPortal`: El "Teletransportador" 🌀

Imagina que eres **Dr. Strange**. Estás en una habitación (un componente), abres un portal mágico, y envías un objeto a la cima del Everest (el `<body>` del documento), aunque tú sigas estando en la habitación.

Eso hace `createPortal`. Te permite renderizar un hijo en una parte del DOM **completamente diferente** a donde está su padre, pero manteniendo la conexión lógica.

#### 1. ¿Qué problema resuelve? (La pesadilla del CSS) 😫

Imagina que tienes una tarjeta pequeña con `overflow: hidden` o un `z-index` bajo. Dentro de esa tarjeta, quieres abrir un **Modal** o un **Tooltip**.

- **Sin Portal:** El Modal se verá cortado por los límites de la tarjeta o aparecerá detrás de otros elementos.
- **Con Portal:** El Modal se "teletransporta" visualmente al final del `<body>`, quedando por encima de todo, sin que le afecten los estilos restrictivos del padre.

#### 2. Sintaxis

```javascript
import { createPortal } from "react-dom";

createPortal(
  children, // ¿Qué quieres renderizar? (JSX)
  domNode // ¿A dónde lo quieres enviar? (Elemento del DOM nativo)
);
```

---

### 3. Ejemplo Práctico: Un Modal Reutilizable 🪟

Este es el caso de uso #1. Queremos usar el componente `<Modal>` dentro de cualquier parte de nuestra App, pero queremos que en el HTML real se pinte fuera de todo.

```jsx
import { createPortal } from "react-dom";

// 1. EL COMPONENTE TELETRANSPORTADO
function Modal({ children, onClose }) {
  // A dónde lo enviamos: document.body
  // (En apps grandes, a veces se crea un <div id="modal-root"></div> en el HTML)
  const destino = document.body;

  return createPortal(
    // Este es el JSX que aparecerá en el <body>
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg">
        {children}
        <button
          onClick={onClose}
          className="mt-4 bg-red-500 text-white p-2 rounded"
        >
          Cerrar
        </button>
      </div>
    </div>,
    destino // El segundo argumento es el destino
  );
}

// 2. EL COMPONENTE PADRE
// Fíjate que el padre tiene un estilo restrictivo (overflow-hidden)
export default function App() {
  const [abierto, setAbierto] = useState(false);

  return (
    <div className="p-10 border-4 border-blue-500 overflow-hidden h-32 relative">
      <p>Soy una caja pequeña con overflow hidden.</p>

      <button onClick={() => setAbierto(true)}>Abrir Modal</button>

      {/* Aunque renderizamos el Modal AQUÍ DENTRO, 
         gracias al portal, se pintará fuera de esta caja azul 
         y no se verá cortado.
      */}
      {abierto && (
        <Modal onClose={() => setAbierto(false)}>
          <h2>¡Hola desde el Portal!</h2>
          <p>Estoy flotando sobre todo.</p>
        </Modal>
      )}
    </div>
  );
}
```

---

### 4. El "Truco de Magia": Event Bubbling (Burbujeo) 🫧

Esto es lo más importante y lo que suele preguntar la gente en entrevistas.

Aunque el Modal se pinte físicamente en el `<body>` (lejos del componente padre en el HTML), **para React, el Modal sigue estando dentro del componente padre.**

**Consecuencia:**
Si haces clic en el Modal, el evento `onClick` **sube (burbujea)** hasta el componente padre en React, aunque en el DOM no sean parientes.

```jsx
<div onClick={() => console.log("¡Click atrapado por el padre!")}>
  <Modal>
    {/* Si haces click aquí, el div de arriba LO ESCUCHA */}
    <button>Hazme click</button>
  </Modal>
</div>
```

Esto es genial porque no rompe la lógica de tu aplicación.

---

### Resumen de `createPortal`

- **¿Para qué sirve?**: Modals, Tooltips, Menús flotantes (Dropdowns), Notificaciones (Toasts).
- **¿Cambió en React 19?**: No, funciona igual. Es una API estable y fundamental.
- **Clave**: Renderiza en otro lado del DOM, pero se comporta como un hijo normal en el Árbol de React (eventos, contexto, etc.).

---
