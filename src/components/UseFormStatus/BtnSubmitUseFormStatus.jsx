import { useFormStatus } from "react-dom";

export function BtnSubmitUseFormStatus() {
 // Este hook "mira hacia arriba" buscando el <form> padre más cercano
   const { pending, data, method, action } = useFormStatus();
 console.log('data: ', data)
 console.log('method: ', method)
 console.log('action: ', action)
   return (
     <button 
       type="submit" 
       disabled={pending}
       className={'px-4 py-2 rounded text-white bg-gray-400'}
     >
       {pending ? "Guardando..." : "Guardar Información"}
     </button>
   );
}