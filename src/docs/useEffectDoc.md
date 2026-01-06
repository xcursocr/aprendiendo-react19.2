**`useEffect`** es el hook más famoso, pero también el más malinterpretado.

En **React 19**, su rol ha cambiado drásticamente. Antes lo usábamos para **todo** (traer datos, leer formularios). Ahora, su uso es mucho más específico.

### ¿Qué es `useEffect`?

Es el hook para manejar **Efectos Secundarios (Side Effects)**.
Un "Efecto Secundario" es cualquier cosa que tu componente necesite hacer **después** de pintarse en la pantalla y que afecte al mundo exterior (fuera de React).

**Ejemplos de "Mundo Exterior":**

* Cambiar el título de la pestaña (`document.title`).
* Suscribirse a un evento del teclado (`window.addEventListener`).
* Conectar un Chat en tiempo real (WebSockets).
* Integrar una librería de mapas (Google Maps) que no es de React.

---

### 1. La Sintaxis (El Array de Dependencias 🕵️)

`useEffect` acepta dos argumentos. El segundo (el array `[]`) es el que controla cuándo se ejecuta.

```javascript
useEffect(() => {
  // Código que se ejecuta...
}, [dependencias]);

```

Hay **3 escenarios** posibles y tienes que dominarlos:

#### A. Sin Array (Peligroso ⚠️)

```javascript
useEffect(() => {
  console.log("Me ejecuto en CADA renderizado");
});

```

* **¿Cuándo?** Cada vez que el componente se pinta (por cualquier cambio).
* **Uso:** Rara vez se usa. Puede causar bucles infinitos si actualizas un estado dentro.

#### B. Array Vacío `[]` (Solo al nacer 👶)

```javascript
useEffect(() => {
  console.log("Me ejecuto SOLO UNA VEZ al montar");
}, []);

```

* **¿Cuándo?** Solo la primera vez que el componente aparece en pantalla.
* **Uso:** Inicializar cosas (WebSockets, Mapas, Event Listeners).

#### C. Array con Variables `[id, nombre]` (Vigilante 👀)

```javascript
useEffect(() => {
  console.log("Me ejecuto al inicio Y cuando cambie 'id' o 'nombre'");
}, [id, nombre]);

```

* **¿Cuándo?** Al inicio y cada vez que `id` o `nombre` sean diferentes al render anterior.
* **Uso:** Sincronizar algo cuando cambian los datos (ej: reiniciar un chat si cambia el `userId`).

---

### 2. La Limpieza (El "Cleanup") 🧹

Esto es vital. A veces, un efecto crea un "desastre" (ej: deja una conexión abierta). React te permite devolver una función para **limpiar** ese desastre antes de que el componente desaparezca o antes de ejecutar el efecto de nuevo.

**Ejemplo: Escuchar el tamaño de la ventana**

```jsx
import { useState, useEffect } from 'react';

export default function WindowTracker() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    // 1. EL EFECTO: Creamos el listener
    const handleResize = () => setWindowWidth(window.innerWidth);
    
    window.addEventListener('resize', handleResize);

    // 2. LA LIMPIEZA (Cleanup Function): 
    // React ejecuta esto cuando el componente se desmonta (muere).
    // Si no hacemos esto, tendremos múltiples listeners zombies comiendo memoria.
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // [] = Solo queremos configurar el listener una vez

  return <h1>Ancho de pantalla: {windowWidth}px</h1>;
}

```

---

### 3. El Gran Cambio en React 19 🚨

Aquí es donde muchos se confunden. **¿Para qué NO debo usar `useEffect` en React 19?**

❌ **No lo uses para traer datos (Fetching):**

* *Antes:* `useEffect(() => { fetch(...) }, [])`
* *Ahora:* Usas **`use(Promise)`** o lo haces directo en el componente (si usas Server Components) como vimos en tu Starter Kit.

❌ **No lo uses para eventos del usuario:**

* *Antes:* Un efecto que escuchaba si el usuario hacía clic.
* *Ahora:* Usas los manejadores de eventos (`onClick`, `onChange`) o **Server Actions**.

❌ **No lo uses para transformar datos:**

* *Antes:* `useEffect` para calcular el total cuando cambia el carrito.
* *Ahora:* Lo calculas directamente en el cuerpo del componente o usas **`useMemo`**.

### 4. ¿Cuándo SÍ usarlo en React 19?

Úsalo para **Sincronización con sistemas externos**.

**Ejemplo Válido: Conectar un chat (WebSocket)**

```jsx
import { useEffect, useState } from 'react';

function SalaDeChat({ roomId }) {
  const [mensajes, setMensajes] = useState([]);

  useEffect(() => {
    // 1. Conectamos al sistema externo (Socket)
    const connection = createConnection(roomId);
    connection.connect();

    connection.on('mensaje', (msg) => {
      setMensajes(prev => [...prev, msg]);
    });

    // 2. Limpiamos al cambiar de sala o salir
    return () => {
      connection.disconnect();
      console.log("Desconectado de", roomId);
    };
  }, [roomId]); // IMPORTANTE: Si roomId cambia, se desconecta del viejo y conecta al nuevo.

  return (
    <ul>
       {mensajes.map(m => <li key={m.id}>{m.text}</li>)}
    </ul>
  );
}

```

### Resumen

* **`useEffect`** es para sincronizar tu componente con cosas que React no controla (Ventana, Timers, Sockets, Plugins de jQuery).
* El **array de dependencias `[]**` es tu control remoto: tú decides cuándo se ejecuta.
* Siempre escribe una **función de limpieza (`return () => ...`)** si tu efecto deja algo "encendido".
* En **React 19**, úsalo lo menos posible. Prefiere `use()`, `useActionState` o cálculo directo.
