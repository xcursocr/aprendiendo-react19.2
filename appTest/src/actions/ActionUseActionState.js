
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";
const TABLE = "users";

export async function ActionUseActionState(prevState, formData) {
  const email = formData.get("email"); // Obtenemos el valor del input nativamente

  // Validación simple
  if (!email.includes("@")) {
    return { success: false, message: "❌ Email inválido" };
  }

   const url = `${API_BASE_URL}/api/v1/${TABLE}?${queryString}`;

  // Éxito
  return { success: true, message: "✅ ¡Gracias por suscribirte, " + email + "!" };
}
