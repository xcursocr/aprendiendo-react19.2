import { UseCallbackList } from "../../components/UseCallBack/UseCallbackList";

export function UseCallbackPage() {
  return (
    <>
      <div className="container-info">
        <span className="font-bold">useCallback </span> es un hook fundamental
        para el rendimiento (performance).
        <br />
        <br />
        Su trabajo es evitar que una función se vuelva a crear innecesariamente
        cada vez que tu componente se renderiza.
        <br />
        <br />
        1. El Problema: "Las funciones son objetos nuevos" 🧠 En JavaScript,
        cada vez que se ejecuta una función (como tu componente), las variables
        y funciones que están adentro se crean de nuevo. Mira esto: JavaScript
        <br />
        <br />
        useCallback le dice a React: "Guarda esta función en el congelador y 
        no crees una nueva a menos que sea estrictamente necesario".
      </div>
      <div className="container-title">
        <span className="font-bold"> Ejemplo Práctico:</span> 
        <p>Una Lista Pesada</p>
      </div>
      <div className="container-custom">
        <UseCallbackList />
      </div>
    </>
  );
}
