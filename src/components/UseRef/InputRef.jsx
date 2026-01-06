import { useRef } from "react";

export function InputRef() {
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
      <div className="flex justify-center">
        <input
          ref={inputRef}
          type="text"
          placeholder="Escribe aquí..."
          className="input-custom"
        />
        <button onClick={handleClick} className="btn-custom">
          Hacer Foco
        </button>
      </div>
    </>
  );
}
