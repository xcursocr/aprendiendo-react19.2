**`<input>`**, **`<textarea>`** y **`<select>`**.

Como te adelantaba, el cambio aquí es **filosófico**. Durante años, React nos enseñó a controlar _cada_ pulsación de tecla con `useState`. En React 19, volvemos a confiar en el navegador, lo que simplifica tu código enormemente.

---

### 1. El gran cambio: Controlados vs. No Controlados 🔓

#### ❌ La "Vieja Escuela" (Componentes Controlados)

Antes, si querías un input, tenías que "esclavizarlo" a un estado de React.

- **Problema:** Si escribes rápido, React tiene que renderizar _todo_ el componente por cada letra que pulsas. En formularios grandes, esto se vuelve lento.

```jsx
// React 18 (Verborrágico)
const [nombre, setNombre] = useState(""); // Estado innecesario
// ...
<input
  value={nombre}
  onChange={(e) => setNombre(e.target.value)} // Render en cada tecla 🐢
/>;
```

#### ✅ La "Nueva Escuela" (Componentes No Controlados)

En React 19, gracias a las **Server Actions** y al nuevo `<form>`, simplemente le das un nombre al input y dejas que el navegador guarde el texto. React solo lo lee cuando envías el formulario.

```jsx
// React 19 (Limpio)
<input
  name="nombre"
  defaultValue="Usuario Anónimo" // Valor inicial opcional
/>
// ¡Cero useState! 🚀
```

---

### 2. Atributos Clave en React 19 🔑

Para que esta magia funcione, debes dominar dos atributos:

1. **`name` (OBLIGATORIO):**
   Es la "etiqueta" con la que React encontrará el dato dentro del `formData`. Si olvidas ponerle `name`, el dato no llegará a tu función `action`.
2. **`defaultValue` (En lugar de `value`):**
   Como ya no controlamos el input con estado, usamos `defaultValue` para decirle: _"Empieza con este texto, pero deja que el usuario lo cambie libremente"_.

- Si usas `value`, el input se bloqueará (read-only) a menos que tengas un `onChange`.

---

### 3. Ejemplo Práctico: Perfil de Usuario 📝

Vamos a crear un formulario de perfil con los tres elementos (`input`, `textarea`, `select`) sin usar ni un solo `useState` para los campos.

```jsx
import { useActionState } from "react";

async function guardarPerfil(prevState, formData) {
  // Simulamos guardado
  await new Promise((r) => setTimeout(r, 1000));

  // LEEMOS LOS DATOS NATIVAMENTE GRACIAS AL ATRIBUTO 'name'
  const nombre = formData.get("nombreCompleto");
  const bio = formData.get("biografia");
  const rol = formData.get("rolUsuario");

  console.log("Guardando:", { nombre, bio, rol });

  return { mensaje: "✅ Perfil actualizado correctamente" };
}

export default function EditarPerfil() {
  const [state, formAction, isPending] = useActionState(guardarPerfil, null);

  return (
    <form
      action={formAction}
      className="p-6 border rounded shadow-md max-w-md mx-auto mt-10"
    >
      <h2 className="text-xl font-bold mb-4">Editar Perfil</h2>

      {/* 1. INPUT SIMPLE */}
      <div className="mb-4">
        <label className="block text-sm font-bold mb-1">Nombre</label>
        <input
          name="nombreCompleto" // Clave para formData
          defaultValue="Alex Dev" // Valor inicial
          className="w-full p-2 border rounded"
          placeholder="Tu nombre aquí"
        />
      </div>

      {/* 2. SELECT (DROPDOWN) */}
      <div className="mb-4">
        <label className="block text-sm font-bold mb-1">Rol</label>
        <select
          name="rolUsuario"
          defaultValue="desarrollador"
          className="w-full p-2 border rounded"
        >
          <option value="admin">Administrador</option>
          <option value="desarrollador">Desarrollador</option>
          <option value="visitante">Visitante</option>
        </select>
      </div>

      {/* 3. TEXTAREA */}
      <div className="mb-4">
        <label className="block text-sm font-bold mb-1">Biografía</label>
        <textarea
          name="biografia"
          defaultValue="Me encanta React..."
          rows={4}
          className="w-full p-2 border rounded"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700 disabled:bg-gray-400"
      >
        {isPending ? "Guardando..." : "Guardar Cambios"}
      </button>

      {state?.mensaje && (
        <p className="mt-4 text-green-600 font-bold text-center">
          {state.mensaje}
        </p>
      )}
    </form>
  );
}
```

### 4. ¿Cuándo SÍ usar `useState` en inputs? 🤔

No me malinterpretes, `useState` no ha muerto. Aún lo necesitas en casos muy específicos:

1. **Validación en tiempo real:** Si quieres que el borde se ponga rojo _mientras_ el usuario escribe (antes de enviar).
2. **Input Masking:** Si necesitas formatear automáticamente un teléfono `(555) 123-4567` mientras escriben.
3. **Dependencias:** Si cambiar el `select` de "País" debe cambiar las opciones del `select` de "Ciudad" inmediatamente.

Para todo lo demás (formularios de registro, login, contacto, configuración), **el método no controlado de React 19 es superior**.

---

### Resumen de la sección

- Usa **`name`** para identificar el dato.
- Usa **`defaultValue`** para valores iniciales.
- Deja que **`formData`** recolecte los valores por ti.
- Tu código será más limpio y tu app más rápida.
