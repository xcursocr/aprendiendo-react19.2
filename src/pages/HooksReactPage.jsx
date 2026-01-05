import { CodeHtml } from "../components/common/CodeHtml";
import {
    HookUseId,
    HookUseRef,
    HookUseRefCronometro,
    HookUseRefMiInputPadre
} from "../components/learn.react/hooks/HooksReact";

export function HooksReactPage() {
  return (
    <>
      <div>
        <h2>Hook useId() React</h2>
      </div>
      <HookUseId />
      <hr />
      <div>
        <h2>Hook useRef() React</h2>
      </div>
      <CodeHtml
        lang={"html"}
        children={`
            Uso 1: Acceder al DOM (El uso más común)
A veces necesitas "salir" de React y tocar el HTML directamente, por ejemplo: para poner el foco en un input, reproducir un video o medir el tamaño de un div.

Ejemplo: Un input que se enfoca solo
`}
      />
      <HookUseRef />
      <CodeHtml
        lang={"html"}
        children={`
            Uso 2: Guardar valores "Silenciosos"
Imagina que necesitas guardar un ID de un temporizador (setInterval) para poder detenerlo después. No quieres que cada milisegundo tu componente se vuelva a pintar, solo quieres guardar ese número ID.

Ejemplo: Un Cronómetro
        `}
      />
      <HookUseRefCronometro />
      <CodeHtml
        lang={"html"}
        children={`
            Novedad en React 19 🌟
            Antes, si querías pasar una ref de un componente padre a un hijo, tenías que usar una función extraña llamada forwardRef.
            
            En React 19, eso ya no es necesario. Ahora ref es una prop normal.
            `}
            />

      <HookUseRefMiInputPadre />
      <CodeHtml
        lang={"html"}
        children={`
            En resumen: Usa useRef cuando necesites "tocar" un elemento HTML o cuando necesites recordar algo sin obligar a React a dibujar todo de nuevo.
            `}
            />

            <hr />
<div>
  <h2>useActionState(action, initialState, permalink?)</h2>
</div>

      <CodeHtml
        lang={"html"}
        children={`
            Vamos con useActionState. Este es, sin duda, el hook más importante de React 19 para el manejo de datos y formularios.

Si useState es para guardar datos y useEffect es para sincronizar cosas, useActionState es el "Piloto Automático" de tus formularios.

¿Qué problema resuelve?
Antes de React 19, enviar un formulario era doloroso. Tenías que crear manualmente 3 estados para controlar todo el ciclo de vida:

const [data, setData] = useState(null) (Para la respuesta)

const [isLoading, setIsLoading] = useState(false) (Para el spinner)

const [error, setError] = useState(null) (Para el mensaje de error)

Y luego tenías que escribir un try/catch, poner loading(true) al principio, loading(false) al final... ¡Mucho código repetitivo!

¿Qué hace useActionState?
Este hook automatiza todo eso. Tú le das una función asíncrona (tu lógica) y él te devuelve:

El estado actual (resultado).

La acción para conectar al formulario.

Un booleano isPending (cargando) automático.

La Sintaxis
JavaScript

const [state, formAction, isPending] = useActionState(fn, initialState);
fn: La función que contiene la lógica (enviar a la API, guardar en BD).

initialState: El valor inicial (ej: null, [], o { message: '' }).

state: El valor que retornó tu función la última vez.

formAction: La función que pasas al <form action={...}>.

isPending: true mientras la función se ejecuta, false al terminar.
        `}
      />

      <HookUseActionState />
    </>
  );
}
