/**
 Preload de Recursos (preload, preinit)
El Problema: El navegador empieza a descargar una imagen o fuente solo cuando "lee" la etiqueta <img> o el CSS. 
Esto causa parpadeos (layout shift). React 19: Puedes decirle al navegador "Oye, empieza a descargar esto YA, 
porque lo voy a necesitar pronto", incluso antes de renderizar.
 */

import { preload } from 'react-dom';

export function LoginPage() {
  // Le decimos al navegador que descargue la fuente MIENTRAS carga el JS
  preload('/fonts/inter-bold.woff2', { as: 'font' });
  
  // O pre-cargamos una imagen pesada que se verá al hacer login
  const handleHover = () => {
    preload('/images/dashboard-bg.jpg', { as: 'image' });
  };

  return (
    <div onMouseEnter={handleHover}>
      <h1>Bienvenido</h1>
      {/* ... */}
    </div>
  );
}