
**`useContext`** es el hook de la **"Teletransportación de Datos"**. 🛸

Si `useState` maneja la memoria local de un componente, `useContext` maneja la **memoria global o compartida** sin tener que pasarla de mano en mano.

---

### 1. El Problema: "Prop Drilling" (Taladro de Props) 😫

Imagina que tienes una aplicación con esta estructura:
`Abuelo` -> `Padre` -> `Hijo` -> `Nieto`.

Si el `Abuelo` tiene un dato (ej. "Modo Oscuro") y el `Nieto` lo necesita, normalmente tendrías que pasarlo así:

1. Abuelo se lo da a Padre.
2. Padre se lo da a Hijo (aunque Padre no lo use).
3. Hijo se lo da a Nieto.

Esto se llama **Prop Drilling** y hace que tu código sea sucio y difícil de mantener.

---

### 2. La Solución: `useContext` 📡

`useContext` funciona como una **Señal Wi-Fi**.

1. El `Abuelo` enciende el Router (Provider).
2. Cualquier componente abajo (Hijo, Nieto, Bisnieto) puede conectarse a esa señal y obtener el dato directamente, ignorando a los intermediarios.

### 3. Ejemplo Práctico: Un Tema (Dark/Light Mode)

Vamos a ver cómo se hace en **React 19** (que es un poco más limpio que antes).

```jsx
import { createContext, useContext, useState } from "react";

// 1. CREAMOS EL CONTEXTO (El canal de comunicación)
// Puede estar en un archivo aparte, ej: ThemeContext.js
const ThemeContext = createContext(null);

export default function App() {
  const [theme, setTheme] = useState("light");

  return (
    // 2. EL PROVEEDOR (El Router Wi-Fi)
    // En React 19 ya no necesitas poner <ThemeContext.Provider>, basta con <ThemeContext>
    <ThemeContext value={{ theme, setTheme }}>
      <div className="p-10 border">
        <h1>Soy el Abuelo (App)</h1>
        {/* Fíjate que a 'BarraNavegacion' NO le pasamos props del tema */}
        <BarraNavegacion />
      </div>
    </ThemeContext>
  );
}

// Componente intermedio que NO le importa el tema
function BarraNavegacion() {
  return (
    <div className="border p-5 m-5">
      <h2>Soy el Padre (Nav) - No uso el tema, solo contengo al hijo.</h2>
      <BotonConfiguracion />
    </div>
  );
}

// 3. EL CONSUMIDOR (Quien usa el hook)
function BotonConfiguracion() {
  // Aquí usamos el hook para "teletransportar" los datos desde el Abuelo
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <div className={`p-5 rounded ${theme === 'dark' ? 'bg-black text-white' : 'bg-gray-100 text-black'}`}>
      <h3>Soy el Nieto</h3>
      <p>El tema actual es: {theme}</p>
      <button 
        onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
        className="bg-blue-500 text-white px-3 py-1 rounded mt-2"
      >
        Cambiar Tema
      </button>
    </div>
  );
}

```

### 4. `useContext` vs. El nuevo hook `use` (React 19) ⚔️

Ya te había mencionado el hook `use` antes. Aquí es donde se conectan.

* **`useContext(Contexto)`**: Es la forma clásica. Funciona perfecto, pero tiene una regla: **Debe usarse al inicio del componente** (no puede ir dentro de un `if`).
* **`use(Contexto)`**: Es la evolución en React 19. Hace lo mismo, pero **sí puedes ponerlo dentro de un `if` o bucles**.

**Ejemplo de la diferencia:**

```jsx
function Componente({ mostrarDetalles }) {
  // ❌ Con useContext (Error si lo pones en un if)
  // const theme = useContext(ThemeContext); 
  
  if (mostrarDetalles) {
    // ✅ Con use (Válido en React 19)
    // Solo nos suscribimos al contexto si realmente lo necesitamos
    const theme = use(ThemeContext);
    return <div className={theme}>Detalles...</div>;
  }
  
  return null;
}

```

### Resumen

1. **`createContext`**: Crea la "nube" o canal.
2. **`<Contexto value={...}>`**: Emite la señal (Provider) desde arriba.
3. **`useContext(Contexto)`**: Capta la señal desde cualquier componente hijo, sin importar qué tan profundo esté.

Es ideal para:

* Datos del Usuario Autenticado.
* Temas (Colores).
* Idioma (Español/Inglés).
* Carritos de compra.
