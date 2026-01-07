### Mapa de hooks **por paquete** (React 19.2+) + orden recomendado de estudio

Basado en el API Reference actual de React 19.2 (donde se listan los hooks por paquete) [useFormStatus – React](https://react.dev/reference/react-dom/hooks/useFormStatus) y en las notas oficiales de React 19/19.2 para hooks nuevos [React v19 – React](https://react.dev/blog/2024/12/05/react-19) + [React 19.2 – React](https://react.dev/blog/2025/10/01/react-19-2).

| Paquete | Hooks que te interesan | Orden recomendado |
|---|---|---|
| `react` | `useState`, `useReducer`, `useRef`, `useEffect`, `useLayoutEffect`, `useContext`, `useMemo`, `useCallback`, `useId`, `useTransition`, `useDeferredValue`, `useSyncExternalStore`, `useImperativeHandle`, `useInsertionEffect`, `useDebugValue`, **(React 19+)** `useActionState`, `useOptimistic`, `useEffectEvent` | 1) Estado → 2) Efectos → 3) Refs → 4) Memo → 5) Context → 6) Concurrencia → 7) Stores externos → 8) Hooks nuevos (19+) |
| `react-dom` | `useFormStatus` | Después de `useActionState` |
| `use-sync-external-store` (paquete separado) | `useSyncExternalStore`, `useSyncExternalStoreWithSelector` | Si haces librerías / compat con React < 18 |

> Nota importante: `useActionState` **antes** se llamaba `useFormState` en canary, pero se renombró y el anterior quedó deprecado ([useActionState – React](https://react.dev/reference/react/useActionState), nota dentro de la doc).

A continuación tienes cada hook **por paquete**, con **concepto**, **ejemplo práctico** y **notas/pitfalls**.

## Paquete: `react`

### 1) `useState`
#### Concepto
Estado local simple: un valor + setter. Re-renderiza al actualizar.

#### Ejemplo práctico (contador)
```jsx
import { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(c => c + 1)}>
      Count: {count}
    </button>
  );
}
```

#### Notas importantes
- Si el siguiente estado depende del anterior, usa la forma funcional: `setCount(c => c + 1)`.
- Actualizar state **no** es inmediato; React “agenda” el render.

---

### 2) `useReducer`
#### Concepto
Estado con “máquina de estados” (acciones + reducer). Mejor que `useState` cuando hay múltiples transiciones.

#### Ejemplo práctico (todo mini)
```jsx
import { useReducer } from "react";

function reducer(state, action) {
  switch (action.type) {
    case "add":
      return [...state, { id: crypto.randomUUID(), text: action.text }];
    case "remove":
      return state.filter(t => t.id !== action.id);
    default:
      return state;
  }
}

export function Todos() {
  const [todos, dispatch] = useReducer(reducer, []);

  return (
    <>
      <button onClick={() => dispatch({ type: "add", text: "Aprender hooks" })}>
        Add
      </button>
      <ul>
        {todos.map(t => (
          <li key={t.id}>
            {t.text}{" "}
            <button onClick={() => dispatch({ type: "remove", id: t.id })}>
              X
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
```

#### Notas importantes
- El reducer debe ser **puro** (sin mutaciones ni side-effects).
- Útil para estados con “acciones” (forms complejas, wizards).

---

### 3) `useRef`
#### Concepto
Un contenedor mutable (`{ current }`) que **no** dispara renders al cambiar. También para refs a DOM.

#### Ejemplo práctico (enfocar input)
```jsx
import { useRef } from "react";

export function FocusInput() {
  const inputRef = useRef(null);

  return (
    <>
      <input ref={inputRef} placeholder="Escribe..." />
      <button onClick={() => inputRef.current?.focus()}>
        Focus
      </button>
    </>
  );
}
```

#### Notas importantes
- No uses `ref.current = ...` como mecanismo para “sincronizar UI”; para eso es state.
- Ideal para: DOM, timers, “último valor”, integraciones externas.

---

### 4) `useEffect`
#### Concepto
Sincroniza con sistemas externos **después** del render: subscripciones, timers, fetch (con cuidado), listeners.

#### Ejemplo práctico (suscripción a evento)
```jsx
import { useEffect, useState } from "react";

export function WindowWidth() {
  const [w, setW] = useState(window.innerWidth);

  useEffect(() => {
    const onResize = () => setW(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return <p>Width: {w}px</p>;
}
```

#### Notas importantes
- En StrictMode (dev) React puede montar/desmontar para detectar bugs: tu cleanup debe ser correcto.
- No uses `useEffect` para derivar estado que puedes calcular en render.

---

### 5) `useLayoutEffect`
#### Concepto
Como `useEffect` pero corre **antes de pintar**. Sirve para medir/layout sin “flicker”.

#### Ejemplo práctico (medir alto)
```jsx
import { useLayoutEffect, useRef, useState } from "react";

export function MeasureBox() {
  const ref = useRef(null);
  const [h, setH] = useState(0);

  useLayoutEffect(() => {
    setH(ref.current?.getBoundingClientRect().height ?? 0);
  });

  return (
    <>
      <div ref={ref} style={{ padding: 12, border: "1px solid #ccc" }}>
        Caja medible
      </div>
      <p>Alto: {h}px</p>
    </>
  );
}
```

#### Notas importantes
- Evítalo si no es necesario: bloquea el paint.
- En SSR puede advertir; muchos frameworks sugieren evitarlo en server.

---

### 6) `useInsertionEffect`
#### Concepto
Efecto ultra-temprano para **inyección de estilos** (pensado para CSS-in-JS). Normalmente tú **no** lo necesitas.

#### Ejemplo práctico (conceptual)
```jsx
import { useInsertionEffect } from "react";

export function CssInJsLibraryInternals() {
  useInsertionEffect(() => {
    // Insertar stylesheet antes de layout/paint
  }, []);

  return null;
}
```

#### Notas importantes
- Úsalo casi exclusivamente si construyes una librería de estilos.
- No es para fetch, subscriptions, etc.

---

### 7) `useEffectEvent` (React 19.2)
#### Concepto
Extrae lógica “tipo evento” fuera de un Effect para **leer el estado/props más recientes** sin re-ejecutar el effect innecesariamente. Oficial desde React 19.2 [React 19.2 – React](https://react.dev/blog/2025/10/01/react-19-2) y con restricciones claras [useEffectEvent – React](https://react.dev/reference/react/useEffectEvent).

#### Ejemplo práctico (evitar “reconectar” por cambios no relevantes)
```jsx
import { useEffect, useEffectEvent } from "react";

export function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    // Siempre ve el theme más nuevo
    console.log("Connected with theme:", theme);
  });

  useEffect(() => {
    const connection = createConnection(roomId);
    connection.on("connected", () => onConnected());
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ no depende de theme
}
```

#### Notas importantes (muy clave)
- El “event” **solo debe llamarse dentro de Effects** (no como handler de click, no como prop), según la doc [useEffectEvent – React](https://react.dev/reference/react/useEffectEvent).
- No lo uses como “truco” para saltarte dependencias; úsalo para separar lo reactivo (deps del effect) de lo no-reactivo.

---

### 8) `useContext`
#### Concepto
Lee un Context (config global, theme, user, i18n).

#### Ejemplo práctico
```jsx
import { createContext, useContext } from "react";

const ThemeContext = createContext("light");

function Badge() {
  const theme = useContext(ThemeContext);
  return <span className={`badge badge--${theme}`}>Badge</span>;
}

export function App() {
  return (
    <ThemeContext value="dark">
      <Badge />
    </ThemeContext>
  );
}
```

#### Notas importantes
- Si el value cambia, re-renderiza consumidores.
- Para evitar renders masivos, separa contextos (uno por “concern”).

---

### 9) `useMemo`
#### Concepto
Memoiza un **cálculo** para no recalcularlo en cada render.

#### Ejemplo práctico (filtrado caro)
```jsx
import { useMemo, useState } from "react";

export function FilteredList({ items }) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    return items.filter(x => x.toLowerCase().includes(q.toLowerCase()));
  }, [items, q]);

  return (
    <>
      <input value={q} onChange={e => setQ(e.target.value)} />
      <ul>{filtered.map(x => <li key={x}>{x}</li>)}</ul>
    </>
  );
}
```

#### Notas importantes
- `useMemo` es una optimización: si tu app funciona sin él, mejor.
- Si tus deps cambian siempre (objetos nuevos), no ayuda.

---

### 10) `useCallback`
#### Concepto
Memoiza una **función** para estabilidad referencial (útil con `memo`, deps de effects, etc.).

#### Ejemplo práctico
```jsx
import { useCallback, useState } from "react";

export function Parent() {
  const [n, setN] = useState(0);

  const increment = useCallback(() => setN(x => x + 1), []);

  return <button onClick={increment}>n: {n}</button>;
}
```

#### Notas importantes
- Si no pasas callbacks a hijos memoizados, suele ser innecesario.
- Si el callback usa valores, deben ir en deps (o usar setState funcional).

---

### 11) `useId`
#### Concepto
Genera IDs estables entre server/client para accesibilidad (labels, aria).

#### Ejemplo práctico
```jsx
import { useId } from "react";

export function LabeledInput() {
  const id = useId();
  return (
    <>
      <label htmlFor={id}>Email</label>
      <input id={id} type="email" />
    </>
  );
}
```

#### Notas importantes
- No es para keys de listas.
- En React 19.2 hubo cambios del formato/prefijo para compatibilidad (mencionado en el post) [React 19.2 – React](https://react.dev/blog/2025/10/01/react-19-2).

---

### 12) `useTransition`
#### Concepto
Marca actualizaciones como “no urgentes”: mantiene UI responsiva mientras se actualiza en segundo plano.

#### Ejemplo práctico (búsqueda)
```jsx
import { useState, useTransition } from "react";

export function Search({ allItems }) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState(allItems);
  const [isPending, startTransition] = useTransition();

  function onChange(e) {
    const next = e.target.value;
    setQ(next); // urgente (input)
    startTransition(() => {
      setResults(allItems.filter(x => x.includes(next)));
    });
  }

  return (
    <>
      <input value={q} onChange={onChange} />
      {isPending && <p>Buscando...</p>}
      <ul>{results.map(x => <li key={x}>{x}</li>)}</ul>
    </>
  );
}
```

#### Notas importantes
- Útil cuando una actualización “pesada” compite con input/scroll.
- En React 19, `startTransition` soporta funciones `async` (“Actions”) según el post [React v19 – React](https://react.dev/blog/2024/12/05/react-19).

---

### 13) `useDeferredValue`
#### Concepto
Difiere un valor para renderizar versiones “suaves” (ej. lista) mientras la entrada (input) se mantiene inmediata.

#### Ejemplo práctico (input inmediato, lista diferida)
```jsx
import { useDeferredValue, useMemo, useState } from "react";

export function DeferredSearch({ allItems }) {
  const [q, setQ] = useState("");
  const dq = useDeferredValue(q);

  const results = useMemo(
    () => allItems.filter(x => x.includes(dq)),
    [allItems, dq]
  );

  return (
    <>
      <input value={q} onChange={e => setQ(e.target.value)} />
      <p>Buscando: {dq}</p>
      <ul>{results.map(x => <li key={x}>{x}</li>)}</ul>
    </>
  );
}
```

#### Notas importantes
- Buen fit cuando el valor es “derivado” y no quieres transiciones manuales.
- React 19 trae mejoras y menciona `initialValue` en notas de versión (según el post) [React v19 – React](https://react.dev/blog/2024/12/05/react-19).

---

### 14) `useSyncExternalStore`
#### Concepto
Suscribirse correctamente a stores externos (Redux-like) sin tearing en concurrent rendering.

#### Ejemplo práctico (store simple)
```jsx
import { useSyncExternalStore } from "react";

const store = (() => {
  let value = 0;
  const listeners = new Set();
  return {
    getSnapshot: () => value,
    subscribe: (l) => (listeners.add(l), () => listeners.delete(l)),
    inc: () => { value++; listeners.forEach(l => l()); }
  };
})();

export function StoreCounter() {
  const value = useSyncExternalStore(store.subscribe, store.getSnapshot);

  return <button onClick={store.inc}>store: {value}</button>;
}
```

#### Notas importantes
- Para librerías: preferir esto vs “useState+subscribe manual”.

---

### 15) `useImperativeHandle`
#### Concepto
Define la API expuesta por un ref (cuando un padre necesita llamar métodos del hijo).

#### Ejemplo práctico (focus desde el padre)
```jsx
import { forwardRef, useImperativeHandle, useRef } from "react";

const FancyInput = forwardRef(function FancyInput(props, ref) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
  }));

  return <input ref={inputRef} />;
});

export function Parent() {
  const ref = useRef(null);
  return (
    <>
      <FancyInput ref={ref} />
      <button onClick={() => ref.current?.focus()}>Focus child</button>
    </>
  );
}
```

#### Notas importantes
- Úsalo poco; suele indicar acoplamiento.
- Con React 19 existe “`ref` como prop”, pero esto sigue siendo útil para APIs imperativas.

---

### 16) `useDebugValue`
#### Concepto
Mejora la visualización de hooks custom en React DevTools.

#### Ejemplo práctico
```jsx
import { useDebugValue, useState } from "react";

function useOnlineStatus() {
  const [online] = useState(true);
  useDebugValue(online ? "Online" : "Offline");
  return online;
}
```

#### Notas importantes
- No afecta producción; es ergonomía.

---

### 17) `useOptimistic` (React 19)
#### Concepto
Estado optimista durante una mutación/acción: muestra “lo que va a pasar” mientras llega la respuesta. Introducido en React 19 [React v19 – React](https://react.dev/blog/2024/12/05/react-19).

#### Ejemplo práctico (nombre optimista)
```jsx
import { useOptimistic } from "react";

export function OptimisticName({ currentName, saveName }) {
  const [optimisticName, setOptimisticName] = useOptimistic(currentName);

  async function onSubmit(formData) {
    const next = formData.get("name");
    setOptimisticName(next);
    await saveName(next);
  }

  return (
    <form action={onSubmit}>
      <p>Nombre: {optimisticName}</p>
      <input name="name" defaultValue={currentName} />
      <button type="submit">Guardar</button>
    </form>
  );
}
```

#### Notas importantes
- Brilla junto a Actions/Transitions: UI inmediata, server después.
- Debes pensar cómo “revierte” si hay error (error boundary / manejo del action).

---

### 18) `useActionState` (React 19)
#### Concepto
Hook para ejecutar Actions (frecuentemente desde `<form action={...}>`) y obtener:
1) `state` (resultado anterior), 2) `formAction` (acción envuelta), 3) `isPending`.
Doc oficial: [useActionState – React](https://react.dev/reference/react/useActionState). Introducido en React 19 [React v19 – React](https://react.dev/blog/2024/12/05/react-19).

#### Ejemplo práctico (errores del submit)
```jsx
import { useActionState } from "react";

async function action(prevState, formData) {
  const email = formData.get("email");
  if (!String(email).includes("@")) return { error: "Email inválido" };
  await fakeSave(email);
  return { error: null };
}

export function EmailForm() {
  const [state, formAction, isPending] = useActionState(action, { error: null });

  return (
    <form action={formAction}>
      <input name="email" placeholder="email@dominio.com" />
      <button type="submit" disabled={isPending}>
        {isPending ? "Guardando..." : "Guardar"}
      </button>
      {state.error && <p style={{ color: "crimson" }}>{state.error}</p>}
    </form>
  );
}
```

#### Notas importantes
- El action recibe `prevState` como **primer** argumento (pitfall común).
- Fue `useFormState` en canary y se renombró (deprecado) [useActionState – React](https://react.dev/reference/react/useActionState).

---

## Paquete: `react-dom`

### 1) `useFormStatus` (React DOM 19)
#### Concepto
Hook para leer el estado del `<form>` padre: `pending`, `data`, `method`, `action`. Doc oficial: [useFormStatus – React](https://react.dev/reference/react-dom/hooks/useFormStatus).

#### Ejemplo práctico (botón submit que se deshabilita solo)
```jsx
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? "Enviando..." : "Enviar"}
    </button>
  );
}

export function MyForm({ action }) {
  return (
    <form action={action}>
      <input name="name" />
      <SubmitButton />
    </form>
  );
}
```

#### Notas importantes (pitfall típico)
- `useFormStatus` **debe** llamarse en un componente **dentro** del `<form>`; no “trackea” un `<form>` definido en el mismo componente que llama el hook (está documentado como pitfall) [useFormStatus – React](https://react.dev/reference/react-dom/hooks/useFormStatus).

---

## Paquete: `use-sync-external-store` (para compatibilidad / librerías)

### `useSyncExternalStore` y `useSyncExternalStoreWithSelector`
#### Concepto
Mismo objetivo que `React.useSyncExternalStore`, pero empaquetado para compatibilidad (por ejemplo, librerías que soportan múltiples versiones).

#### Ejemplo práctico (selector para evitar renders)
```jsx
import { useSyncExternalStoreWithSelector } from "use-sync-external-store/with-selector";

export function SelectedValue({ store }) {
  const selected = useSyncExternalStoreWithSelector(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot ?? store.getSnapshot,
    (snap) => snap.user.id
  );

  return <p>UserId: {selected}</p>;
}
```

#### Notas importantes
- Este paquete lo usan mucho librerías (Redux, Zustand, etc.) para soportar rangos de React.

---

## ¿Cómo lo estudiamos “uno por uno” sin abrumarte?
Si estás de acuerdo, te propongo este plan en 4 “sprints” y en cada sprint te doy **ejercicios** (mini-proyectos) para practicar:

1) **Estado**: `useState`, `useReducer` (ej: counter, todo, form con reducer)  
2) **Efectos**: `useEffect`, `useLayoutEffect`, `useEffectEvent` (ej: websocket simulado + evitar reconexiones)  
3) **Performance**: `useMemo`, `useCallback`, `useDeferredValue`, `useTransition`  
4) **React 19 Forms**: `useActionState`, `useOptimistic` + `react-dom/useFormStatus`

Dime con cuál sprint quieres empezar (1–4) y te armo una guía con:
- explicación corta,
- checklist mental,
- 2–3 ejercicios prácticos,
- y “errores típicos” a propósito para que los detectes.