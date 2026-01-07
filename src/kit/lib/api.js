// <-- Tus llamadas fetch limpias

/**
 El Problema: Imagina que tienes un componente Header que muestra el nombre del usuario y un Profile que muestra su bio. 
 Ambos necesitan llamar a api.getUser().
Antes: Hacías la llamada dos veces (ineficiente) o tenías que pasar los datos por props desde el padre (prop drilling).
React 19: Usas cache. Si llamas a la función 10 veces en la misma renderización, React solo la ejecuta una vez.
 */

import { cache } from "react";

// Envolvemos la función de la API con cache
export const getUser = cache(async (id) => {
  console.log("⚡ LLAMANDO A LA API REAL..."); // Solo verás esto 1 vez
  const res = await fetch(`/api/users/${id}`);
  return res.json();
});

// EJEMPLO DE USO

/*
// Componente A
function Header() {
  const user = use(getUser(1)); // Lee del caché si ya se pidió
  return <nav>Hola, {user.name}</nav>;
}

// Componente B
function Profile() {
  const user = use(getUser(1)); // ¡No hace fetch! Usa el resultado anterior
  return <div>Bio: {user.bio}</div>;
}
  */
