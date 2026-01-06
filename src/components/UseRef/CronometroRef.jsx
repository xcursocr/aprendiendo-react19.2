import { useRef, useState } from 'react';

export function CronometroRef() {
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
      <h1 className='mx-3 py-4'><span className='mx-3 font-black'>{segundos}</span> segundo's</h1>
      <button onClick={iniciar} className='bg-slate-500 btn-custom'>Iniciar</button>
      <button onClick={detener} className='btn-custom'>Detener</button>
    </div>
  );
}
