import { useActionState } from "react";

// ✅ 1. LA FUNCIÓN DE ACCIÓN (Lógica)
// Esta SÍ es async. Recibe prevState y formData.
// Nota: En Vite, esto se ejecuta en el navegador del cliente.
async function updateNameAction(prevState, formData) {
  // Simulamos retardo de red
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Aquí es donde usas .get(), NO dentro del componente
  const name = formData.get("name");

  if (!name) {
    return { error: "El nombre es obligatorio", success: false };
  }

  return { 
    message: `Hola, ${name}! Formulario procesado correctamente.`, 
    success: true 
  };
}

// ✅ 2. EL COMPONENTE (Vista)
// Esta función NO lleva 'async'. Es síncrona.
export default function HookUseActionState() {
  // Hook configuration
  const [state, formAction, isPending] = useActionState(updateNameAction, null);

  return (
    <div className="shadow-md mx-auto mt-10 p-4 border rounded max-w-md">
      <h2 className="mb-4 font-bold text-xl">Ejemplo useActionState (Vite)</h2>

      {/* Usamos formAction en el atributo action */}
      <form action={formAction} className="flex flex-col gap-3">
        
        <div>
          <label className="block font-medium text-sm">Nombre:</label>
          <input 
            type="text" 
            name="name" 
            className="p-2 border rounded w-full"
            placeholder="Escribe tu nombre..."
          />
        </div>

        <button 
          type="submit" 
          disabled={isPending}
          className={`px-4 py-2 text-white rounded transition-colors ${
            isPending ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isPending ? "Procesando..." : "Actualizar Nombre"}
        </button>
      </form>

      {/* Mostrar resultados o errores */}
      {state?.error && (
        <p className="mt-4 font-bold text-red-500">❌ {state.error}</p>
      )}
      
      {state?.success && (
        <p className="mt-4 font-bold text-green-600">✅ {state.message}</p>
      )}
    </div>
  );
}