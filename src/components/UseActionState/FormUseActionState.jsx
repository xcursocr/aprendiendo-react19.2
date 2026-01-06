import { useActionState } from "react";
import { ActionUseActionState } from "../../actions/ActionUseActionState";

export default function FormUseActionState() {
  // Configuración del hook
  // Estado inicial: null (aún no ha pasado nada)
  const [state, action, isPending] = useActionState(ActionUseActionState, null);

  return (
  <div className="shadow-md mx-auto mt-10 p-6 border rounded max-w-md">
    <form action={action} className="p-4 rounded">
      <h3>Suscríbete</h3>
      
      <input 
        name="email" 
        type="email" 
        placeholder="tu@email.com" 
        className="mr-2 p-2 border"
        disabled={isPending} // Deshabilitamos mientras carga
      />
      
      <button 
        type="submit" 
        disabled={isPending} // Deshabilitamos mientras carga
        className="bg-blue-600 disabled:bg-gray-400 p-2 rounded text-white"
      >
        {isPending ? "Enviando..." : "Suscribirme"}
      </button>

      {/* Mostramos el mensaje del estado (si existe) */}
      {state && (
        <p className={state.success ? "text-green-600" : "text-red-600"}>
          {state.message}
        </p>
      )}
    </form>
    </div>
  );
}
