export function UseNuevoContext({ mostrarDetalles }) {
  // ❌ Con useContext (Error si lo pones en un if)
  // const theme = useContext(ThemeContext);

  if (mostrarDetalles) {
    // ✅ Con use (Válido en React 19)
    // Solo nos suscribimos al contexto si realmente lo necesitamos
    const theme = use(ThemeContext);
    return <div className={theme}>Detalles...</div>;
  }

  return null;
}
