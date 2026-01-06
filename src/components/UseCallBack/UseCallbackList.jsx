import { useCallback, useState } from "react";
import { UseCallbackHijoMemo } from "./UseCallbackHijoMemo";

export function UseCallbackList() {
  const [contador, setContador] = useState(0);
  const [darkTheme, setDarkTheme] = useState(false);

  // ❌ FORMA MALA (Sin useCallback):
  // Cada vez que cambias el tema o el contador, se crea una NUEVA función.
  // Eso hace que 'UseCallbackHijoMemo' piense que sus props cambiaron y se renderiza de nuevo.
  /* const handleDelete = (id) => {
    console.log("Eliminando", id);
  }; 
  */

  // ✅ FORMA BUENA (Con useCallback):
  // La función se "congela". React reutiliza la misma instancia entre renders.
  // Como la función es la misma, 'UseCallbackHijoMemo' NO se renderiza de nuevo.
  const handleDelete = useCallback((id) => {
    console.log("Eliminando tarea", id);
  }, []); // No depende de nada externo, así que Array vacío.

  return (
    <div className={`p-8 ${darkTheme ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
      <h2 className="font-bold text-xl">Ejemplo useCallback</h2>
      
      <div className="flex gap-4 my-4">
        <button 
          onClick={() => setContador(c => c + 1)}
          className="bg-blue-600 px-4 py-2 rounded text-white"
        >
          Contador: {contador} (Renderiza al Padre)
        </button>

        <button 
          onClick={() => setDarkTheme(t => !t)}
          className="bg-purple-600 px-4 py-2 rounded text-white"
        >
          Cambiar Tema
        </button>
      </div>

      {/* Pasamos la función al hijo */}
      <UseCallbackHijoMemo eliminarItem={handleDelete} />
      
      <p className="inline-block bg-yellow-100 mt-4 p-2 rounded text-yellow-800 text-xs">
        Abre la consola (F12). Si usas useCallback, al hacer clic en los botones de arriba, 
        el mensaje rojo "🔴 Renderizando UseCallbackHijoMemo" <strong>NO</strong> debería aparecer.
      </p>
    </div>
  );

}