import { useId, useRef } from "react";
import { CodeHtml } from "../../common/CodeHtml";

/**
   useId es un hook introducido en React 18 que sirve para generar identificadores (IDs) únicos y estables.
   El uso más común es vincular etiquetas (<label>) con campos de formulario (<input>), o vincular textos de ayuda 
   con atributos ARIA (como aria-describedby).
   Para que un lector de pantalla sepa que un Label pertenece a un Input, deben compartir el mismo ID:
 */

export function HookUseId() {
  const passwordId = useId(); // Genera algo como ":r0:"

  return (
    <>
      {/* El htmlFor y el id deben ser idénticos */}
      <label htmlFor={passwordId}>Contraseña:</label>
      <input
        id={passwordId}
        type="password"
        aria-describedby={`${passwordId}-hint`}
      />
      <p id={`${passwordId}-hint`}>La contraseña debe tener 8 caracteres.</p>

      <div>
        <CodeHtml
          lang={"html"}
          children={`
    import { useId } from "react";
    const passwordId = useId(); // Genera algo como ":r0:"

    useId es un hook introducido en React 18 que sirve para generar identificadores (IDs) únicos y estables.
    El uso más común es vincular etiquetas (<label>) con campos de formulario (<input>), o vincular textos de ayuda 
    con atributos ARIA (como aria-describedby).
    Para que un lector de pantalla sepa que un Label pertenece a un Input, deben compartir el mismo ID:


    3. Truco Pro: Usar un solo useId para varios campos
    No necesitas llamar al hook por cada input. Puedes llamar al hook una vez por componente y añadir sufijos:
    <form>
      <label htmlFor={id + '-nombre'}>Nombre</label>
      <input id={id + '-nombre'} type="text" />

      <label htmlFor={id + '-apellido'}>Apellido</label>
      <input id={id + '-apellido'} type="text" />
    </form>

    ⚠️ Advertencia Importante
    NO uses useId para generar "keys" en una lista.

    // ❌ MAL
<ul>
  {items.map(item => (
    <li key={useId()}>{item.name}</li> // ¡Esto rompe el rendimiento!
  ))}
</ul>

// ✅ BIEN
<ul>
  {items.map(item => (
    <li key={item.id}>{item.name}</li> // Usa el ID que viene de tu base de datos
  ))}
</ul>

En resumen: Úsalo siempre que necesites conectar dos elementos HTML mediante atributos id, especialmente para formularios y accesibilidad.


            `}
        />
      </div>
    </>
  );
}

export function HookUseRef() {
  // 1. Creamos la referencia (inicialmente vacía/null)
  const inputRef = useRef(null);

  const handleClick = () => {
    // 3. Accedemos al elemento HTML real usando .current
    // Esto es equivalente a document.getElementById('...').focus()
    inputRef.current.focus(); 
    
    // También podemos hacer cosas como:
    // inputRef.current.style.backgroundColor = 'yellow';
  };

  return (
    <>
      {/* 2. Conectamos la referencia al elemento HTML */}
      <input ref={inputRef} type="text" placeholder="Escribe aquí..." />
      <button onClick={handleClick}>Hacer Foco</button>
    </>
  );
}

import { useState } from 'react';

export function HookUseRefCronometro() {
  const [segundos, setSegundos] = useState(0);
  
  // Usamos useRef para guardar el ID del intervalo.
  // Si usáramos useState, causaría renders innecesarios o sería difícil de leer dentro del intervalo.
  const intervaloRef = useRef(null);

  const iniciar = () => {
    // Si ya hay un intervalo corriendo, no hacemos nada
    if (intervaloRef.current) return;

    intervaloRef.current = setInterval(() => {
      setSegundos(s => s + 1);
    }, 1000);
  };

  const detener = () => {
    clearInterval(intervaloRef.current);
    intervaloRef.current = null; // Reseteamos la referencia
  };

  return (
    <div>
      <h1>{segundos}s</h1>
      <button onClick={iniciar}>Iniciar</button>
      <button onClick={detener}>Detener</button>
    </div>
  );
}

// Componente Hijo (Input personalizado)
 function HookUseRefMiInputHijo({ ref, placeholder }) {
  // Antes necesitabas forwardRef, ahora recibes 'ref' directo aquí
  return <input ref={ref} placeholder={placeholder} className="p-2 border" />;
}

// Componente Padre
export function HookUseRefMiInputPadre() {
  const inputRef = useRef(null);
  
  return <HookUseRefMiInputHijo ref={inputRef} placeholder="React 19 lo hace fácil" />;
}
