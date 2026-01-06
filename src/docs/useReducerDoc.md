**`useReducer`** es el "Hermano Mayor y Musculoso" de `useState`.

Si `useState` es para manejar una variable sencilla (como un interruptor de luz), **`useReducer` es para manejar un panel de control completo.**

---

### 1. El Problema: El "Espagueti" de `useState` 🍝

Imagina que tienes un carrito de compras.
Para agregar un producto tienes que:

1. Verificar si ya existe.
2. Si existe, aumentar la cantidad.
3. Si no, agregarlo al array.
4. Calcular el total del precio.
5. Actualizar el contador de items.

Si haces esto con `useState`, tu componente se llenará de lógica compleja y dispersa.

### 2. La Solución: `useReducer` 🗄️

Este hook te permite **sacar la lógica de negocio fuera del componente**.
Funciona igual que una **Cuenta Bancaria**:

1. Tú no entras a la bóveda y tomas dinero (`state = state + 100`). ❌
2. Tú le das una instrucción al cajero (`dispatch({ type: 'DEPOSITAR', cantidad: 100 })`). ✅
3. El cajero (Reducer) sigue las reglas y actualiza el saldo.

### 3. La Sintaxis

```javascript
const [state, dispatch] = useReducer(reducer, initialState);

```

* **`state`**: El estado actual (el dinero en el banco).
* **`dispatch`**: La función para enviar órdenes (la ventanilla del cajero).
* **`reducer`**: La función que contiene las reglas (el manual del cajero).
* **`initialState`**: El saldo inicial.

---

### 4. Ejemplo Práctico: Carrito de Compras 🛒

Mira qué limpio queda el componente. Toda la lógica "sucia" está aislada en la función `cartReducer`.

```jsx
import { useReducer } from 'react';

// 1. EL REDUCER (Las Reglas del Juego)
// Esta función vive FUERA del componente. Es pura lógica.
function cartReducer(state, action) {
  switch (action.type) {
    case 'AGREGAR':
      return { 
        ...state, 
        items: [...state.items, action.payload],
        total: state.total + action.payload.price 
      };
    
    case 'ELIMINAR':
      const itemEliminado = state.items.find(i => i.id === action.id);
      return {
        ...state,
        items: state.items.filter(i => i.id !== action.id),
        total: state.total - (itemEliminado ? itemEliminado.price : 0)
      };

    case 'VACIAR':
      return { items: [], total: 0 };

    default:
      return state;
  }
}

// 2. EL COMPONENTE
export default function ShoppingCart() {
  // Inicializamos el reducer
  const [state, dispatch] = useReducer(cartReducer, { 
    items: [], 
    total: 0 
  });

  const productos = [
    { id: 1, name: 'Zapatillas', price: 100 },
    { id: 2, name: 'Camiseta', price: 20 }
  ];

  return (
    <div className="p-10 max-w-md mx-auto border rounded shadow-lg">
      <h2 className="text-xl font-bold mb-4">Carrito con useReducer</h2>

      {/* Lista de Productos Disponibles */}
      <div className="flex gap-2 mb-6">
        {productos.map(prod => (
          <button
            key={prod.id}
            // AQUÍ DISPARAMOS LA ORDEN (ACTION)
            onClick={() => dispatch({ type: 'AGREGAR', payload: prod })}
            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
          >
            + {prod.name} (${prod.price})
          </button>
        ))}
      </div>

      {/* Resumen del Carrito */}
      <div className="bg-gray-50 p-4 rounded border">
        <h3 className="font-bold border-b pb-2 mb-2">Mi Cesta:</h3>
        
        {state.items.length === 0 ? (
          <p className="text-gray-400 text-sm">El carrito está vacío</p>
        ) : (
          <ul className="space-y-2">
            {state.items.map((item, index) => (
              <li key={index} className="flex justify-between text-sm">
                <span>{item.name}</span>
                <button 
                  // OTRA ORDEN
                  onClick={() => dispatch({ type: 'ELIMINAR', id: item.id })}
                  className="text-red-500 font-bold hover:underline"
                >
                  (x)
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-4 pt-2 border-t flex justify-between items-center">
          <span className="font-bold text-lg">Total: ${state.total}</span>
          <button 
            // OTRA ORDEN
            onClick={() => dispatch({ type: 'VACIAR' })}
            className="text-xs text-gray-500 underline"
          >
            Vaciar todo
          </button>
        </div>
      </div>
    </div>
  );
}

```

### 5. `useState` vs. `useReducer` 🥊

| Característica | `useState` | `useReducer` |
| --- | --- | --- |
| **Complejidad** | Baja (Strings, Números, Booleanos). | Alta (Objetos complejos, Arrays anidados). |
| **Lógica de actualización** | Simple (`setState(nuevoValor)`). | Compleja (depende de acciones y lógica anterior). |
| **Ubicación del código** | Dentro del componente. | Se puede extraer fuera (más limpio y testearle). |
| **Depuración** | Difícil rastrear quién cambió qué. | Fácil (puedes hacer log de cada acción). |

### 6. Relación con React 19 y `useActionState`

Es importante no confundirlos:

* **`useReducer`:** Es para el estado **CLIENTE** (interfaz, carritos, juegos, filtros). Es síncrono.
* **`useActionState`:** Es para interactuar con el **SERVIDOR** (formularios, bases de datos). Es asíncrono.

**Resumen:**
Usa `useReducer` cuando sientas que tienes demasiados `useState` juntos que dependen unos de otros, o cuando la lógica para actualizar tu estado se está volviendo un lío de `if/else` dentro de tu componente.

