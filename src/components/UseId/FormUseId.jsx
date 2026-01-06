import { useId } from "react";

export function FormUseId() {
  const id = useId();

  return (
    <div className="shadow-md mx-auto mt-10 p-6 border rounded max-w-md">
      <span className="text-gray-800 text-xs text-balance">const id = useId() - Genera un id por cada Input para que se lo asigne dinamicamente</span>
     <hr />
      <form className="flex flex-col space-y-3 p-2">
        <label htmlFor={id + "-nombre"} className="p-1 text-xs">Nombre <span className="text-gray-400 text-xs">(Click en etiqueta para focus input)</span></label>
        <input id={id + "-nombre"} type="text" className="p-1 border border-gray-300 rounded-sm"/>

        <label htmlFor={id + "-apellido"} className="p-1 text-xs">Apellido <span className="text-gray-400 text-xs">(Click en etiqueta para focus input)</span></label>
        <input id={id + "-apellido"} type="text" className="p-1 border border-gray-300 rounded-sm"/>
      </form>
    </div>
  );
}
