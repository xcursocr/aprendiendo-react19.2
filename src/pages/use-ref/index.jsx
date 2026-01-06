import { CronometroRef } from "../../components/UseRef/CronometroRef";
import { InputRef } from "../../components/UseRef/InputRef";

export function UseRefPage() {
  return (
    <>
      <div className="container-title">
        <p className="font-bold">Uso 1: Acceder al DOM (El uso más común)</p>
      </div>

      <div className="container-info">
        Tiene dos superpoderes que lo hacen único:
        <br />
        <br />
        Persistencia: La información que guardas dentro no se pierde cuando el
        componente se vuelve a renderizar (igual que el useState).
      </div>

      <div className="container-custom">
        <>
          <InputRef />
        </>
      </div>

      <div className="container-title">
        <p className="font-bold">Uso 2: Guardar valores "Silenciosos"</p>
      </div>

      <div className="container-info">
        Silencio: Cuando cambias el valor de .current, NO provoca un
        re-renderizado. Imagina que necesitas guardar un ID de un temporizador
        (setInterval) para poder detenerlo después.
        <br />
        <br />
        No quieres que cada milisegundo tu componente se vuelva a pintar, solo
        quieres guardar ese número ID.
        <br />
        <br />
        React no se entera y no actualiza la vista. A veces necesitas "salir" de
        React y tocar el HTML directamente, por ejemplo: para poner el foco en
        un input, reproducir un video o medir el tamaño de un div.
      </div>

      <div className="container-custom">
        <>
          <CronometroRef />
        </>
      </div>
      <div className="container-title">
        <p className="font-black">Novedad en React 19 🌟</p>
      </div>

      <div className="container-info">
        Antes, si querías pasar una ref de un componente padre a un hijo, tenías
        que usar una función extraña llamada forwardRef. En React 19, eso ya no
        es necesario. Ahora ref es una prop normal.
<br />
<br />
        <span className="font-bold">En resumen:</span> Usa useRef cuando necesites "tocar" un elemento HTML o cuando necesites recordar algo sin obligar a React a dibujar todo de nuevo.

      </div>
    </>
  );
}
