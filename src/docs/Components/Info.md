Components DOM
A simple vista, parece "HTML normal", pero en **React 19** algunos de estos componentes han recibido **superpoderes** que cambian por completo cómo arquitecturamos la aplicación.

No es solo `className` en lugar de `class`. Hay cambios profundos en cómo React trata etiquetas específicas como `<form>`, `<title>`, `<meta>`, `<link>` y `<script>`.

Aquí tienes el análisis de lo que es **realmente nuevo y especial** en React 19 para los componentes comunes.

---

### 1. La Revolución del `<form>` 🔥

Este es el cambio más drástico. En HTML normal, un form envía una petición HTTP y recarga la página. En React viejo, usabas `onSubmit`.

En **React 19**, la etiqueta `<form>` ahora soporta funciones en la prop `action`.

- **HTML Normal:** `<form action="/ruta_servidor">` (Recarga la página).
- **React 19:** `<form action={miFuncionAsincrona}>` (Maneja el estado de carga, errores y optimismo automáticamente).

```jsx
// React 19
<form
  action={async (formData) => {
    await guardarDatos(formData);
  }}
>
  <input name="titulo" />
  <button>Guardar</button>
</form>
```

> **Lo especial:** React intercepta el envío, gestiona el ciclo de vida de la transición y permite usar hooks como `useFormStatus` dentro de los hijos.

---

### 2. Metadatos "Mágicos" (`<title>`, `<meta>`) 🪄

Antes necesitabas librerías como `react-helmet`. Ahora, estos componentes tienen un comportamiento especial llamado **Hoisting (Elevación)**.

Puedes poner un `<title>` dentro de un `<div>` enterrado en lo más profundo de tu aplicación, y React 19 automáticamente lo "teletransportará" a la sección `<head>` del documento HTML.

```jsx
function Producto() {
  return (
    <div>
      {/* Esto se mueve mágicamente al <head> */}
      <title>Zapatillas Nike | Tienda</title>
      <meta name="description" content="Las mejores zapatillas..." />

      <h1>Detalle del producto</h1>
    </div>
  );
}
```

---

### 3. Carga de Recursos (`<link>`, `<script>`, `<style>`) ⚡

React 19 ahora gestiona la carga de recursos externos para evitar duplicados y mejorar el rendimiento.

- **Hojas de Estilo (`<link rel="stylesheet">`):**
  Si tres componentes diferentes renderizan `<link rel="stylesheet" href="boton.css" />`, React es inteligente y **solo lo carga una vez** en el DOM. Además, puedes especificar `precedence` para controlar el orden de carga.
- **Scripts (`<script async>`):**
  React ahora maneja la carga de scripts de forma que no bloqueen el renderizado, moviéndolos al lugar correcto del DOM.

```jsx
function MiComponente() {
  return (
    <div>
      {/* React gestiona que esto no se duplique y se cargue en orden */}
      <link
        rel="stylesheet"
        href="estilos-especiales.css"
        precedence="default"
      />
      <div className="clase-especial">Hola</div>
    </div>
  );
}
```

---

### 4. Adiós a `forwardRef` en componentes comunes 👋

Aunque esto aplica a tus propios componentes, afecta cómo interactúas con los del DOM.
Antes, si querías pasar una `ref` a un componente funcional que envolvía un `<div>`, era un dolor de cabeza.

Ahora, `ref` es una prop más.

```jsx
// React 19: Funciona nativamente
function MiInput({ ref, ...props }) {
  return <input ref={ref} {...props} />;
}
```

---

### 5. Soporte para "Custom Elements" (Web Components) 🤝

Si alguna vez intentaste usar Web Components (etiquetas personalizadas tipo `<mi-calendario>`) en React viejo, sabrás que era una pesadilla porque React no manejaba bien las propiedades vs. atributos.

**React 19 pasa el 100% de los tests de "Custom Elements Everywhere".**
Ahora puedes usar componentes creados con Lit, Stencil o Vanilla JS dentro de React sin problemas extraños.

```jsx
// React 19 maneja correctamente las propiedades complejas aquí
<my-web-component date={currentDate} onEvent={handleEvent} />
```

---

### Resumen: ¿Qué debo vigilar en la documentación?

No pierdas tiempo leyendo sobre `<div>`, `<span>` o `<p>`, esos siguen igual. Concéntrate en leer las secciones nuevas de:

1. **`<form>`**: Por las Server Actions.
2. **`<input>` / `<textarea>` / `<select>**`: Revisa cómo `defaultValue`y`value` interactúan con los nuevos hooks de formulario.
3. **`<link>` y `<meta>**`: Por el nuevo sistema de metadatos nativo.
4. **`<style>`**: Por la nueva prop `precedence`.
