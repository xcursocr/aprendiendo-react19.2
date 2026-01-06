import { UseNuevoContext } from "../../components/UseContext/Use";
import { UseContextTheme } from "../../components/UseContext/UseContextTheme";

export function UseContextPage() {
  return (
    <>
      <div className="container-title">
        <span className="font-bold">useContext</span> es el hook de la
        "Teletransportación de Datos". 🛸
      </div>
      <div className="space-y-4 container-info">
        <p>
          Si useState maneja la memoria local de un componente, useContext
          maneja la memoria global o compartida sin tener que pasarla de mano en
          mano.
        </p>
        <p>
          1. El Problema: "Prop Drilling" (Taladro de Props) 😫 Imagina que
          tienes una aplicación con esta estructura: Abuelo al Padre al Hijo al
          Nieto.
        </p>
        <p>
          Si el Abuelo tiene un dato (ej. "Modo Oscuro") y el Nieto lo necesita,
          normalmente tendrías que pasarlo así: Abuelo se lo da a Padre.
        </p>
        <p>
          Padre se lo da a Hijo (aunque Padre no lo use). Hijo se lo da a Nieto.
          Esto se llama Prop Drilling y hace que tu código sea sucio y difícil
          de mantener.
        </p>
        <p>
          2. La Solución: useContext 📡 useContext funciona como una Señal
          Wi-Fi.
        </p>
        <p>
          El Abuelo enciende el Router (Provider). Cualquier componente abajo
          (Hijo, Nieto, Bisnieto) puede conectarse a esa señal y obtener el dato
          directamente, ignorando a los intermediarios.
        </p>
      </div>
      <div className="container-title">
        Ejemplo Práctico: Un Tema (Dark/Light Mode)
      </div>
      <div className="container-custom">
        <UseContextTheme />
      </div>

      <div className="space-y-4 container-info">
        <span className="font-bold">
          useContext vs. El nuevo hook use (React 19) ⚔️
        </span>

        <p>
          useContext(Contexto): Es la forma clásica. Funciona perfecto, pero
          tiene una regla: Debe usarse al inicio del componente (no puede ir
          dentro de un if).
        </p>

        <p>
          use(Contexto): Es la evolución en React 19. Hace lo mismo, pero sí
          puedes ponerlo dentro de un if o bucles.
        </p>

        <p>Ejemplo de la diferencia:</p>
      </div>
      <div className="container-custom">
        <UseNuevoContext />
      </div>

      <div className="container-info">
        <p>
          Resumen createContext: Crea la "nube" o canal.
          <pre></pre>: Emite la señal (Provider) desde arriba.
          useContext(Contexto): Capta la señal desde cualquier componente hijo,
          sin importar qué tan profundo esté. Es ideal para: Datos del Usuario
          Autenticado. Temas (Colores). Idioma (Español/Inglés). Carritos de
          compra.
        </p>
      </div>
    </>
  );
}
