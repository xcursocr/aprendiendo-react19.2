### Parte 1: Carga de Recursos (`<style>`, `<link>`, `<script>`) ⚡

React 19 asume un nuevo rol: **"El Controlador de Tráfico Aéreo"**.

Antes, si cargabas un script o una hoja de estilos manualmente dentro de un componente, corrías el riesgo de cargarlo dos veces o bloquear el renderizado. Ahora, React gestiona esto nativamente con **Deduplicación** y **Prioridad**.

#### 1. Hojas de Estilo Inteligentes (`<link>` y `<style>`)

Imagina un componente `<TarjetaCredito>` que necesita estilos muy específicos.

- **El Problema Antiguo:** Si mostrabas 10 tarjetas, el navegador intentaba cargar el CSS 10 veces.
- **La Solución React 19:** React ve que las 10 piden lo mismo y solo carga el archivo **una vez**.

Además, aparece la prop **`precedence`** (precedencia/prioridad).

```jsx
function WidgetPago() {
  return (
    <div>
      {/* React moverá esto al <head> y asegurará que se cargue 
          CON PRIORIDAD ALTA antes de pintar el widget */}
      <link rel="stylesheet" href="estilos-pago.css" precedence="high" />

      <form className="pago-form">{/* ... */}</form>
    </div>
  );
}
```

#### 2. Scripts Asíncronos (`<script>`)

Lo mismo pasa con scripts externos (como Google Analytics, Stripe, Mapas). React ahora soporta `async` de verdad dentro de los componentes.

```jsx
function Mapa() {
  return (
    <div>
      {/* React carga esto sin bloquear la UI y lo ejecuta en orden */}
      <script async src="https://maps.googleapis.com/maps/api/js..." />
      <div id="mapa"></div>
    </div>
  );
}
```

---

### Parte 2: EL GRAN FINAL - Tu Arquitectura "Starter Kit" 🏗️

¡Aquí es donde todo cobra sentido! Vamos a combinar **Hooks** (`useActionState`, `useOptimistic`, `useFormStatus`) con los **Nuevos Componentes** (`<form>`, `<input>`, Metadata).

Imagina que estás construyendo una página de **Perfil de Usuario**.

#### 1. La Estructura de Archivos Recomendada

Para mantener el orden en React 19, te sugiero pensar en:

- `actions/`: Donde vive la lógica de negocio (funciones async).
- `components/`: UI reutilizable.
- `features/`: Componentes complejos específicos de una vista.

#### 2. El Código Completo (Ponte cómodo, esto es pura belleza moderna)

Crea un archivo llamado `UserProfile.jsx`. Fíjate en los comentarios, te guío línea por línea.

```jsx
import { useActionState, useOptimistic } from "react";
import { useFormStatus } from "react-dom";
import SeoHead from "./components/SeoHead"; // Nuestro componente de metadatos

// --- 1. LA ACCIÓN (Simula el Backend) ---
// En una app real, esto llamaría a tu base de datos.
async function updateProfile(prevState, formData) {
  const newName = formData.get("username");

  // Simulamos lentitud de red (1.5 segundos)
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Validación simple
  if (newName.length < 3) {
    return { error: "El nombre es muy corto", success: false };
  }

  // Éxito
  return {
    message: "Perfil actualizado correctamente",
    success: true,
    newName,
  };
}

// --- 2. SUB-COMPONENTE: Botón Inteligente ---
// Extraído para usar useFormStatus()
function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`px-4 py-2 rounded text-white font-bold transition-all ${
        pending
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-blue-600 hover:bg-blue-700"
      }`}
    >
      {pending ? "Guardando..." : "Actualizar Perfil"}
    </button>
  );
}

// --- 3. COMPONENTE PRINCIPAL ---
export default function UserProfile() {
  // A. Estado inicial del usuario (vendría de props o DB)
  const currentName = "Alex Developer";

  // B. Hook para manejar la acción del formulario
  const [state, formAction] = useActionState(updateProfile, null);

  // C. Hook Optimista: Para mostrar el cambio INSTANTÁNEAMENTE
  // Si state.newName existe (el servidor respondió), usamos ese.
  // Si no, usamos el optimista.
  const [optimisticName, setOptimisticName] = useOptimistic(
    state?.newName || currentName, // Valor base
    (current, newName) => newName // Cómo actualizar visualmente
  );

  // D. Intermediario para disparar el optimismo antes de la acción real
  const handleAction = async (formData) => {
    const newName = formData.get("username");

    // 1. ¡Mentira piadosa! Actualizamos la UI ya mismo
    setOptimisticName(newName);

    // 2. Llamamos a la acción real (que tardará 1.5s)
    await formAction(formData);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-xl shadow-2xl bg-white">
      {/* --- E. METADATA Y RECURSOS --- */}
      {/* Hoisting: Esto vuela al <head> automáticamente */}
      <SeoHead
        title={`Perfil de ${optimisticName}`}
        description="Edita tu perfil de usuario"
      />
      {/* Carga inteligente de estilos específicos para este widget */}
      <link
        rel="stylesheet"
        href="/styles/profile-widget.css"
        precedence="default"
      />

      <h1 className="text-2xl font-bold mb-2 text-gray-800">
        Hola, <span className="text-blue-600">{optimisticName}</span> 👋
      </h1>

      <p className="text-gray-500 mb-6 text-sm">
        (Prueba cambiar el nombre. Verás que cambia al instante arriba, aunque
        el botón siga "Guardando")
      </p>

      {/* --- F. EL FORMULARIO REACT 19 --- */}
      <form action={handleAction} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nuevo Nombre
          </label>
          {/* Input no controlado. Sin useState. Limpio. */}
          <input
            name="username"
            defaultValue={optimisticName}
            className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Escribe tu nombre..."
            required
          />
        </div>

        <SaveButton />

        {/* --- G. FEEDBACK DEL SERVIDOR --- */}
        {state?.error && (
          <div className="p-3 bg-red-100 text-red-700 rounded text-sm font-bold animate-pulse">
            ❌ {state.error}
          </div>
        )}

        {state?.success && (
          <div className="p-3 bg-green-100 text-green-700 rounded text-sm font-bold">
            ✅ {state.message}
          </div>
        )}
      </form>
    </div>
  );
}
```

---

### Análisis de lo que acabas de construir 🧐

Fíjate en la potencia de este código. En menos de 100 líneas tienes:

1. **SEO Dinámico:** El título de la pestaña del navegador cambia en tiempo real (`<title>`).
2. **Optimistic UI:** El saludo "Hola, [Nombre]" cambia **0ms** después de hacer clic, aunque el servidor tarde.
3. **Gestión de Estados:** Carga, Error y Éxito manejados por `useActionState` y `useFormStatus`.
4. **Performance:** No hay un solo `useState` controlando el input. Escribir en ese input es rapidísimo porque no provoca re-renders en React.
5. **Recursos:** Carga de CSS bajo demanda.
