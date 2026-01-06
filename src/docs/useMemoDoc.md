 **`useMemo`** es uno de los hooks más populares para optimizar el rendimiento.

Si `useCallback` era el "Congelador de Funciones", **`useMemo` es el "Caché de Resultados"**. 🧠

Su trabajo es recordar el **resultado** de un cálculo costoso para no tener que volver a hacerlo si los datos no han cambiado.

---

### 1. El Problema: Cálculos Innecesarios 😫

Imagina que tienes una función muy pesada (como filtrar 10,000 productos o hacer matemáticas complejas).

```javascript
function MiComponente({ productos, tema }) {
  // 🔴 PROBLEMA:
  // Esta línea se ejecuta en CADA render.
  // Si cambias el 'tema' (Dark Mode), React vuelve a pintar el componente
  // y ¡VUELVE A FILTRAR LOS 10,000 PRODUCTOS! aunque la lista no haya cambiado.
  const productosFiltrados = productos.filter(p => p.precio > 100);

  return <Lista items={productosFiltrados} theme={tema} />;
}

```

Esto hace que tu aplicación se sienta lenta. Cambiar el color de fondo no debería disparar un cálculo matemático pesado.

### 2. La Solución: `useMemo` 💾

`useMemo` le dice a React: *"Guarda este resultado en una caja fuerte. Si me vuelves a pedir el resultado y las dependencias no han cambiado, dame lo que hay en la caja en vez de calcularlo de nuevo."*

**Sintaxis:**

```javascript
const valorMemorizado = useMemo(() => {
  return calculoPesado(a, b);
}, [a, b]); // Solo recalcula si 'a' o 'b' cambian.

```

---

### 3. Ejemplo Práctico: El Filtro Pesado 🐢➡️🐇

Vamos a simular un cálculo lento para que veas la diferencia.

```jsx
import { useState, useMemo } from 'react';

// Función lenta artificialmente
function calculoPesado(numero) {
  console.log("🔄 Calculando...");
  for (let i = 0; i < 1000000000; i++) {} // Bucle gigante para perder tiempo
  return numero * 2;
}

export default function EjemploUseMemo() {
  const [numero, setNumero] = useState(0);
  const [darkTheme, setDarkTheme] = useState(false);

  // ❌ SIN useMemo:
  // Cada vez que cambias el tema, verás "🔄 Calculando..." en la consola
  // y notarás un retraso (lag) al hacer clic.
  // const resultado = calculoPesado(numero);

  // ✅ CON useMemo:
  // Si cambias el tema, React ve que 'numero' no cambió.
  // Ignora la función y devuelve el resultado guardado instantáneamente.
  const resultado = useMemo(() => {
    return calculoPesado(numero);
  }, [numero]); // Dependencia: Solo recalcula si cambia 'numero'

  // Estilos para el tema
  const themeStyles = {
    backgroundColor: darkTheme ? 'black' : 'white',
    color: darkTheme ? 'white' : 'black',
    padding: '20px'
  };

  return (
    <div style={themeStyles}>
      <h2>Ejemplo useMemo</h2>
      
      <input 
        type="number" 
        value={numero} 
        onChange={e => setNumero(parseInt(e.target.value))} 
        className="border p-2 text-black"
      />
      
      <p>Resultado del cálculo lento: <strong>{resultado}</strong></p>

      <button 
        onClick={() => setDarkTheme(!darkTheme)}
        className="bg-blue-500 text-white p-2 mt-4 rounded"
      >
        Cambiar Tema (No debería recalcular)
      </button>
    </div>
  );
}

```

### 4. `useMemo` vs. `useCallback` 🥊

Esta es la pregunta del millón. Ambos optimizan, pero guardan cosas diferentes.

* **`useCallback`** guarda una **FUNCIÓN** para que no se cree de nuevo.
* **`useMemo`** guarda el **RESULTADO** (el valor retornado) de ejecutar una función.

```javascript
// useCallback: Me devuelve la función 'fn' entera.
// Útil para pasarla a hijos (onClick).
const miFuncion = useCallback(() => {
  return a + b;
}, [a, b]);

// useMemo: Ejecuta la función y me devuelve el NÚMERO resultante.
// Útil para datos computados.
const miNumero = useMemo(() => {
  return a + b;
}, [a, b]);

```

### 5. El "Otro" Uso: Integridad Referencial 🔗

A veces no usamos `useMemo` porque el cálculo sea lento, sino porque queremos que un objeto o array sea **exactamente el mismo** en memoria.

En JavaScript: `{ id: 1 } !== { id: 1 }` (Son objetos distintos en memoria).

Si tienes un `useEffect` que depende de un objeto, se ejecutará infinitamente si no usas `useMemo`.

```jsx
function Componente({ usuarioId }) {
  
  // ❌ SIN useMemo: Este objeto se crea nuevo en cada render.
  // const config = { id: usuarioId, admin: true };

  // ✅ CON useMemo: React reutiliza el mismo objeto en memoria.
  const config = useMemo(() => {
    return { id: usuarioId, admin: true };
  }, [usuarioId]);

  useEffect(() => {
    // Si 'config' no estuviera memorizado, este efecto se dispararía
    // en cada render, aunque el usuarioId no cambie.
    api.conectar(config);
  }, [config]); 
}

```

### 6. ¿Cuándo NO usarlo? 🚫

No uses `useMemo` por defecto para todo.

1. **Tiene un costo:** Memorizar consume memoria RAM y CPU (poquito, pero suma).
2. **Complejidad:** Hace el código más difícil de leer.

**Úsalo solo si:**

* Notas que la interacción es lenta (lag).
* Estás pasando objetos/arrays a componentes hijos envueltos en `React.memo`.
* El cálculo es realmente pesado (filtrar miles de filas, gráficos complejos).

¿Queda clara la diferencia entre recordar una función (`useCallback`) y recordar un valor (`useMemo`)?