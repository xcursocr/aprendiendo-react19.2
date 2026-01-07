 **`useLayoutEffect`** Es el **"Gemelo Malvado"** (o más bien, el "Gemelo Obsesivo") de `useEffect`.

Ambos se escriben igual, pero se comportan de forma distinta respecto a **cuándo** permiten que el usuario vea las cosas.

---

### 1. La Gran Diferencia: El "Parpadeo" (Flicker) ⚡

Para entender este hook, necesitas visualizar cómo React pinta la pantalla:

* **Con `useEffect` (Estándar):**
1. React actualiza el DOM (pone los elementos en su sitio).
2. **🎨 El navegador PINTA la pantalla.** (El usuario ve el cambio).
3. Se ejecuta `useEffect`.
4. Si el efecto hace cambios visuales, **React vuelve a renderizar**.


* **Resultado:** El usuario puede ver un "salto" o parpadeo rápido. Ve el estado A por milisegundos y luego el estado B.


* **Con `useLayoutEffect` (Bloqueante):**
1. React actualiza el DOM.
2. **🛑 `useLayoutEffect` se ejecuta AQUÍ.** (El navegador está pausado, el usuario no ve nada nuevo aún).
3. Si el efecto hace cambios, se aplican inmediatamente.
4. **🎨 El navegador PINTA la pantalla.**


* **Resultado:** El usuario ve directamente el estado B final. Cero parpadeos.



---

### 2. ¿Cuándo usarlo? El Caso del Tooltip 📏

El uso clásico es cuando necesitas **medir un elemento** (ancho, alto, posición) para luego ubicarlo en otro lugar.

Imagina un botón que al pasar el mouse muestra un Tooltip.

* No sabes cuánto mide el texto del Tooltip hasta que el navegador lo dibuja.
* Si usas `useEffect`, verás el Tooltip aparecer en la esquina (0,0) y luego "saltar" a su posición correcta.
* Con `useLayoutEffect`, mides y mueves el Tooltip **antes** de que sea visible.

**Ejemplo Práctico:**

```jsx
import { useState, useRef, useLayoutEffect } from 'react';

function Tooltip({ children, targetRect }) {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  // Usamos useLayoutEffect porque necesitamos medir el DOM
  // ANTES de que el usuario vea el tooltip mal posicionado.
  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
    console.log("📏 Medido:", height);
  }, []);

  let tooltipStyle = {
    position: 'absolute',
    top: `${targetRect.top - tooltipHeight}px`, // Lo posicionamos ARRIBA del botón
    left: `${targetRect.left}px`,
    background: 'black',
    color: 'white',
    padding: '5px'
  };

  return (
    <div ref={ref} style={tooltipStyle}>
      {children}
    </div>
  );
}

```

### 3. ¿Por qué no usarlo siempre? 🐢

Si `useLayoutEffect` evita parpadeos, ¿por qué no usarlo para todo?

**Porque bloquea el navegador.**

Si dentro de `useLayoutEffect` haces algo lento (como un cálculo matemático pesado o procesar muchos datos), la pantalla se quedará **congelada** (en blanco o en el estado anterior) hasta que termine.

**Regla de Oro:**

* Empieza siempre con `useEffect`.
* Solo cámbialo a `useLayoutEffect` si notas que hay un **parpadeo visual** feo cuando el componente se monta o actualiza.

### 4. Resumen: Los 3 Hermanos Efecto

Para que tengas el mapa mental completo de React 19:

1. **`useInsertionEffect`:** (El Primero)
* *Cuándo:* Antes de tocar el DOM.
* *Uso:* Inyectar etiquetas `<style>`. (Solo librerías CSS).


2. **`useLayoutEffect`:** (El del Medio)
* *Cuándo:* Después de tocar el DOM, pero **antes** de Pintar.
* *Uso:* Medir tamaños (`getBoundingClientRect`) y corregir posiciones visuales para evitar saltos.


3. **`useEffect`:** (El Último)
* *Cuándo:* Después de Pintar.
* *Uso:* Todo lo demás (API calls, suscripciones, logs). **El 99% de las veces usarás este.**



### 5. Advertencia sobre SSR (Next.js / Remix) ⚠️

Si usas Server-Side Rendering (SSR), `useLayoutEffect` te lanzará una advertencia fea en la consola.

* **Razón:** En el servidor no hay "ventanas", ni "pixeles", ni "pintado". No se puede medir el layout.
* **Solución:** Generalmente se condiciona para que solo corra en el cliente, o se usan librerías que lo manejan por ti.
