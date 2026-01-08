import { cache } from "react";


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";
const TABLE = "users";

// Envolvemos la función de la API con cache
export const getProducts = cache(async () => {
  console.log("⚡ LLAMANDO A LA API REAL..."); // Solo verás esto 1 vez
  const res = await fetch(`${API_BASE_URL}/products?token=false`);
  return res.json();
});

/**
 * function Header() {
  const user = use(getUser(1)); // Lee del caché si ya se pidió
  return <nav>Hola, {user.name}</nav>;
}
 */