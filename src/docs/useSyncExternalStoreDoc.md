Hook de "Nivel Experto".

**`useSyncExternalStore`** es el hook del **"Diplomático"** o el **"Puente Seguro"**. 🌉

Su trabajo es conectar React con datos que viven **fuera** de React (Stores externos como Redux/Zustand, o APIs del navegador) de una manera segura para que la interfaz no se rompa visualmente.

---

### 1. El Problema: "Tearing" (Desgarro Visual) 💔

En React 18 y 19, el renderizado es **concurrente**. Esto significa que React puede pausar el pintado de la pantalla para hacer algo más urgente y luego volver.

Imagina que tienes una tienda global (como Redux) con `valor = 0`.

1. React empieza a pintar el componente A (lee `0`).
2. **Pausa.**
3. Un evento externo cambia el valor a `1`.
4. React reanuda y pinta el componente B (lee `1`).

**Resultado:** En la misma pantalla, el usuario ve el componente A diciendo "0" y el B diciendo "1". Esto se llama **Tearing** (Desgarro).

Antes usábamos `useEffect` para suscribirnos a estos cambios, pero `useEffect` ocurre *después* del renderizado, lo que aumenta el riesgo de estos fallos visuales.

---

### 2. La Solución: `useSyncExternalStore` 🛡️

Este hook le dice a React: *"Oye, voy a leer datos de afuera. Si detectas que estos datos cambian MIENTRAS estás renderizando, tira todo a la basura y vuelve a empezar para que la pantalla sea coherente".*

**Sintaxis:**

```javascript
const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?);

```

1. **`subscribe`**: Una función que recibe un `callback` y se suscribe a los cambios del store.
2. **`getSnapshot`**: Una función que devuelve el valor actual del dato.
3. **`getServerSnapshot`** (Opcional): El valor inicial para Server-Side Rendering (SSR).

---

### 3. Ejemplo Práctico: Estado de la Red (Online/Offline) 🌐

Los datos del navegador (`navigator.onLine`) son un "Store Externo" porque React no los controla.

```jsx
import { useSyncExternalStore } from 'react';

// 1. Defino cómo OBTENER el dato actual (Snapshot)
function getSnapshot() {
  return navigator.onLine;
}

// 2. Defino cómo SUSCRIBIRME a los cambios
function subscribe(callback) {
  // Cuando el navegador diga "online" u "offline", avisamos a React (callback)
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  
  // Función de limpieza (unsubscribe)
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

export default function EstadoRed() {
  // Usamos el hook para conectar React con el Navegador de forma segura
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);

  return (
    <div className={`p-4 ${isOnline ? 'bg-green-100' : 'bg-red-100'}`}>
      <h1>Estado: {isOnline ? '🟢 Conectado' : '🔴 Desconectado'}</h1>
    </div>
  );
}

```

### 4. Ejemplo Avanzado: Tu propio Mini-Redux 📦

Si quisieras crear tu propia librería de gestión de estado global hoy en día, usarías este hook.

```jsx
// --- store.js (Archivo externo, JavaScript puro, nada de React) ---
let estado = { count: 0 };
let listeners = new Set(); // Gente escuchando cambios

export const store = {
  // Método para cambiar datos
  increment() {
    estado = { count: estado.count + 1 };
    listeners.forEach(l => l()); // Avisar a todos
  },
  // Método requerido por el hook: SUSCRIBIRSE
  subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  // Método requerido por el hook: OBTENER DATO
  getSnapshot() {
    return estado;
  }
};

// --- Componente React ---
import { useSyncExternalStore } from 'react';
import { store } from './store';

export default function ContadorGlobal() {
  // Nos conectamos al store externo
  const state = useSyncExternalStore(store.subscribe, store.getSnapshot);

  return (
    <button onClick={store.increment}>
      Cuenta Global: {state.count}
    </button>
  );
}

```

### 5. ¿Cuándo usarlo?

**Casi NUNCA**... a menos que:

1. **Seas autor de una librería:** Estás creando tu propia versión de Redux, Zustand o MobX.
2. **Uses APIs del navegador:** Necesitas leer `window.scrollY`, `window.innerWidth`, `navigator.geolocation` y quieres que sea reactivo y seguro ante la concurrencia.
3. **Integres código Legacy:** Tienes una parte de la app escrita en jQuery o Vanilla JS que tiene sus propios datos y necesitas mostrarlos en React.

**NO lo uses para:**

* Mover datos entre componentes de React (usa `useContext` o `useState`).
* Fetch de datos de una API (usa `useEffect` o `use` + `Suspense`).

### Resumen

* **`useSyncExternalStore`** garantiza que no haya inconsistencias visuales ("tearing") al leer datos externos.
* Es el reemplazo moderno de usar `useEffect` para escuchar eventos globales.
* Es vital para la compatibilidad con el **Rendering Concurrente** de React 18/19.
