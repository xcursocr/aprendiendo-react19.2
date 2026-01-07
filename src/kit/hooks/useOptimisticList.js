// <-- Tu lógica reutilizable

/**
 El Problema: Escribir la lógica de useOptimistic (agregar, borrar, editar) cada vez es propenso a errores.
 Tu Solución: Un hook genérico para cualquier array de datos.
 */

import { useOptimistic } from 'react';

export function useOptimisticList(realItems) {
  const [optimisticItems, setOptimistic] = useOptimistic(
    realItems,
    (currentItems, action) => {
      switch (action.type) {
        case 'add':
          // Agrega al final con flag 'sending'
          return [...currentItems, { ...action.item, sending: true }];
        case 'delete':
          // Filtra inmediatamente
          return currentItems.filter(item => item.id !== action.id);
        case 'update':
          // Actualiza en sitio
          return currentItems.map(item => 
            item.id === action.item.id ? { ...action.item, sending: true } : item
          );
        default:
          return currentItems;
      }
    }
  );

  return {
    items: optimisticItems,
    add: (item) => setOptimistic({ type: 'add', item }),
    remove: (id) => setOptimistic({ type: 'delete', id }),
    update: (item) => setOptimistic({ type: 'update', item })
  };
}

// ¿Cómo lo usas? ¡Esto hace que cualquier CRUD 
/**
 function TodoList({ todos }) {
  // Una sola línea para manejar toda la UI optimista
  const { items, add, remove } = useOptimisticList(todos);

  const handleAdd = async (formData) => {
    const newTodo = { id: Math.random(), text: formData.get('text') };
    
    add(newTodo); // 1. UI Instantánea
    await api.saveTodo(newTodo); // 2. API Real
  };

  return (
    <ul>
      {items.map(todo => (
        <li key={todo.id} className={todo.sending ? 'opacity-50' : ''}>
          {todo.text}
          <button onClick={() => {
             remove(todo.id); // UI Instantánea
             api.deleteTodo(todo.id); // API Real
          }}>x</button>
        </li>
      ))}
    </ul>
  );
}
 */