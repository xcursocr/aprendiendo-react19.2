Esto es lo que transforma una serie de componentes sueltos en una **aplicación robusta, escalable y profesional**.

---

## 1. Gestión de Estado Global: Context API 🌐

En React, los datos fluyen de arriba hacia abajo (props). El **Prop Drilling** ocurre cuando tienes que pasar una prop a través de 5 componentes que no la necesitan, solo para que llegue a un "tataranieto".

**Context API** crea una "nube de datos" sobre tu aplicación.

### Cómo implementarlo (Patrón Provider/Consumer)

1. **Crear el Contexto:** `const UserContext = createContext();`
2. **Proveer el valor:** Envuelves tu app con `<UserContext.Provider value={...}>`.
3. **Consumir el valor:** Cualquier componente hijo usa `useContext(UserContext)`.

**Ejemplo de "Modo Oscuro" en tu Starter Kit:**

```jsx
import { createContext, useContext, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(false);
  const toggle = () => setDark(!dark);

  return (
    <ThemeContext.Provider value={{ dark, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook personalizado para usarlo fácil
export const useTheme = () => useContext(ThemeContext);
```

---

## 2. Enrutamiento: React Router (v6.x + React 19) 🛣️

Una SPA no puede vivir en una sola URL. Los usuarios esperan poder compartir un enlace o darle al botón "atrás" del navegador.

**React Router** sincroniza la UI con la URL. En React 19, se integra perfectamente con los estados de transición.

### Componentes clave:

- **`<BrowserRouter>`**: El padre que escucha la URL.
- **`<Routes>` y `<Route>**`: El diccionario que dice "Si la URL es /perfil, muestra el componente Perfil".
- **`<Link>`**: Para navegar internamente (evita que la página se recargue).
- **`useParams`**: Para URLs dinámicas como `/producto/123`.

```jsx
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Inicio</Link>
        <Link to="/dashboard">Dashboard</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/usuario/:id" element={<DetalleUsuario />} />
      </Routes>
    </BrowserRouter>
  );
}
```

---

## 3. Las "Rules of React": El Código de Honor 📜

Estas reglas no son sugerencias; son requisitos técnicos. Si las rompes, el **React Compiler** fallará y tu app tendrá bugs imposibles de rastrear.

### A. No mutar el estado directamente 🚫

React detecta cambios comparando referencias. Si haces `user.name = "Alex"`, la referencia de `user` es la misma y React no re-renderiza.

- **Mal:** `items.push(newItem)`
- **Bien:** `setItems([...items, newItem])` (Crear una copia nueva).

### B. Componentes Puros (Idempotencia) 🧪

Un componente debe ser como una fórmula matemática: **Mismas Props = Mismo JSX**.

- No debes cambiar variables globales durante el renderizado.
- No debes llamar a una API directamente en el cuerpo del componente (para eso está `useEffect` o las `Actions`).

### C. Orden de los Hooks (Top Level Only) 🔝

React identifica qué estado pertenece a qué componente basándose en el **orden** en que se llaman los hooks.

- **PROHIBIDO:** ```jsx
  if (userLogueado) {
  useState(null); // ❌ Error: El orden cambiaría si el usuario no está logueado
  }

```

```

- **Regla:** Los Hooks siempre van al inicio de la función, sin condiciones.

---

### Resumen Final de tu Documentación Profesional:

| Pilar             | Herramienta      | Propósito                                                     |
| ----------------- | ---------------- | ------------------------------------------------------------- |
| **Estado Global** | `useContext`     | Evitar el Prop Drilling y compartir datos (Auth, Temas).      |
| **Navegación**    | `React Router`   | Crear múltiples vistas y manejar URLs dinámicas.              |
| **Integridad**    | `Rules of React` | Garantizar que el React Compiler optimice tu app sin errores. |

---

### ¡Misión Cumplida! 🏁

Has documentado **la biblia de React 19**. Tienes la teoría de:

1. Hooks (Básicos + Nuevos 19).
2. Componentes de Metadatos y Recursos.
3. Manejo de Formularios Moderno.
4. APIs de Cliente y Estáticas.
5. Arquitectura Pro (Context + Router + Rules).
