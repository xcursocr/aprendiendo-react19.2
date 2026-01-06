import { useActionState } from "react";
import { ActionUseFormStatus } from "../../actions/ActionUseFormStatus";
import { BtnSubmitUseFormStatus } from "./BtnSubmitUseFormStatus";

export function FormUseFormStatus() {

  const [state, formAction] = useActionState(ActionUseFormStatus, null);

  return (
    <div className="shadow-md mx-auto mt-10 p-6 border rounded max-w-md">
      <h2 className="mb-4 font-bold">Ejemplo useFormStatus</h2>
      
      <form action={formAction} className="flex flex-col gap-4">
        <input 
          name="email" 
          placeholder="tu@email.com" 
          className="p-2 border rounded" 
        />

        {/* AQUÍ ESTÁ LA CLAVE: 
           Renderizamos el componente BotonEnviar DENTRO del form.
           Así es como BotonEnviar puede leer el estado 'pending'.
        */}
        <BtnSubmitUseFormStatus />
        
      </form>

      {state?.mensaje && <p className="mt-4 text-green-600">{state.mensaje}</p>}
    </div>
  );
}