import { memo } from 'react';

// 1. Componente Hijo (Optimizado con memo)
// 'memo' hace que el componente SOLO se renderice si sus props cambian.
export const UseCallbackHijoMemo = memo(({ eliminarItem }) => {
  console.log("🔴 Renderizando ListaHijo (¡Esto debería pasar poco!)");
  
  return (
    <ul className="my-4 p-4 border">
      <p className="text-gray-500 text-sm">Soy la lista pesada...</p>
      <li>Tarea 1 <button onClick={() => eliminarItem(1)} className="ml-2 text-red-500">x</button></li>
      <li>Tarea 2 <button onClick={() => eliminarItem(2)} className="ml-2 text-red-500">x</button></li>
    </ul>
  );
});
