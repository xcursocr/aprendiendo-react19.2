**`<form>`**, porque es el **protagonista absoluto** del manejo de datos en React 19.
La nueva etiqueta `<form>` viene a eliminar toneladas de "código boilerplate" (código repetitivo).

---

### 1. El "Antes" vs. El "Ahora" 🥊

Para entender la magnitud del cambio, miremos cómo hacíamos un formulario simple antes.

#### ❌ La Vieja Escuela (React 18)

Mira todo lo que teníamos que escribir para enviar un simple nombre:

```jsx
// CÓDIGO VIEJO (NO COPIAR)
function FormularioViejo() {
  const [nombre, setNombre] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault(); // 1. Prevenir recarga
    setCargando(true); // 2. Activar spinner manual
    setError(null);

    try {
      await enviarAPI(nombre); // 3. Llamar API
      setNombre(""); // 4. Limpiar input manual
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false); // 5. Apagar spinner manual
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={nombre} onChange={(e) => setNombre(e.target.value)} />
      <button disabled={cargando}>Enviar</button>
      {error && <p>{error}</p>}
    </form>
  );
}
```

#### ✅ La Nueva Escuela (React 19)

React 19 absorbe toda esa complejidad.

```jsx
// CÓDIGO NUEVO
function FormularioNuevo() {
  // La función recibe formData automáticamente
  async function action(formData) {
    const nombre = formData.get("nombre"); // Leemos datos nativos
    await enviarAPI(nombre);
    // React resetea el form automáticamente si es exitoso
  }

  return (
    // Usamos 'action', NO 'onSubmit'
    <form action={action}>
      <input name="nombre" />
      <button type="submit">Enviar</button>
    </form>
  );
}
```

---

### 2. Los 3 Superpoderes del nuevo `<form>` 🦸‍♂️

Aquí está lo que hace especial a este componente en la documentación:

#### A. La Prop `action` soporta Funciones

En HTML normal, `action` es una URL (`action="/api/guardar"`).
En React 19, `action` acepta una **función asíncrona**.

- React intercepta el envío.
- Gestiona el ciclo de vida de la petición.
- **Importante:** Si usas `useActionState` (como vimos antes), el `<form>` se conecta automáticamente a él para saber si hay errores o datos de respuesta.

#### B. Reset Automático (Form Reset) 🧹

Esta es una mejora de calidad de vida sutil pero gigante.
En el código viejo, tú tenías que hacer `setNombre("")` después de enviar.
En React 19, si la `action` termina exitosamente, **React resetea automáticamente todos los inputs del formulario** (siempre que sean no controlados, es decir, que no usen `value={state}`).

#### C. Integración con `useFormStatus` 🤝

El componente `<form>` actúa como un **Proveedor de Contexto**.
Cualquier componente hijo (como tu botón de enviar) puede usar el hook `useFormStatus` para saber si _ese_ formulario específico se está enviando.

---

### 3. Ejemplo "Full Stack" en tu Vite App 💻

Vamos a crear un archivo `FormularioModerno.jsx`.
Este ejemplo combina:

1. El nuevo `<form>`.
2. `useActionState` (para feedback).
3. `useFormStatus` (para el botón).
4. Lectura de datos con `FormData`.

```jsx
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

// 1. LA LÓGICA (Simulada)
async function registrarUsuario(prevState, formData) {
  // Simulamos lentitud de red
  await new Promise((r) => setTimeout(r, 1500));

  const email = formData.get("email");

  if (email.includes("error")) {
    return { exito: false, mensaje: "❌ Error simulado (email prohibido)" };
  }

  // Retornamos estado de éxito
  return { exito: true, mensaje: `✅ Usuario ${email} registrado` };
}

// 2. COMPONENTE DE BOTÓN (Para usar useFormStatus)
// Debe estar separado para poder leer el contexto del form padre
function BotonEnviar() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`px-4 py-2 text-white rounded w-full ${
        pending ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
      }`}
    >
      {pending ? "Guardando en base de datos..." : "Registrarse"}
    </button>
  );
}

// 3. EL FORMULARIO PRINCIPAL
export default function FormularioModerno() {
  const [state, formAction] = useActionState(registrarUsuario, null);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-lg bg-white">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Registro React 19
      </h2>

      {/* AQUÍ ESTÁ LA MAGIA: action={formAction} */}
      <form action={formAction} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          {/* Usamos 'name' para identificar el dato. No necesitamos useState ni onChange */}
          <input
            name="email"
            type="email"
            placeholder="tu@email.com"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <BotonEnviar />

        {/* Feedback visual del estado */}
        {state && (
          <div
            className={`p-3 rounded text-center ${
              state.exito
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {state.mensaje}
          </div>
        )}
      </form>
    </div>
  );
}
```

### 4. Una Nota sobre "Server Actions" vs "Client Actions" ⚠️

Como estás usando **Vite** (que es una aplicación que corre solo en el cliente/navegador):

- Tus funciones `action` corren en el navegador del usuario.
- Sigue siendo increíblemente útil porque te organiza el código.

Si estuvieras usando **Next.js** (que tiene servidor):

- Podrías poner la función `registrarUsuario` en el servidor, y el `<form>` funcionaría **incluso si el usuario tiene JavaScript desactivado** en su navegador. Esa es la verdadera potencia de la "Mejora Progresiva" de la que habla la documentación.

### Resumen del `<form>`

1. Usa `action={funcion}` en lugar de `onSubmit`.
2. No uses `e.preventDefault()`, React lo hace por ti.
3. No crees estados (`useState`) para cada input; deja que el formulario recolecte los datos nativamente.
4. El formulario se limpia solo si todo sale bien.
