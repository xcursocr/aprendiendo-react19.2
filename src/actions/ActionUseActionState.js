export async function ActionUseActionState(prevState, formData) {
  const email = formData.get("email"); // Obtenemos el valor del input nativamente
  
  // Simulamos una demora de red
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Validación simple
  if (!email.includes("@")) {
    return { success: false, message: "❌ Email inválido" };
  }

  // Éxito
  return { success: true, message: "✅ ¡Gracias por suscribirte, " + email + "!" };
}
