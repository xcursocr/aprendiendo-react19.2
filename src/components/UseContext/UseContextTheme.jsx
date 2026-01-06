import { createContext, useContext, useState } from "react";


// 1. CREAMOS EL CONTEXTO (El canal de comunicación)
// Puede estar en un archivo aparte, ej: ThemeContext.js
const ThemeContext = createContext(null);


export function UseContextTheme() {
 const [theme, setTheme] = useState("light");

  return (
    // 2. EL PROVEEDOR (El Router Wi-Fi)
    // En React 19 ya no necesitas poner <ThemeContext.Provider>, basta con <ThemeContext>
    <ThemeContext value={{ theme, setTheme }}>
      <div className="p-10 border">
        <h1>Soy el Abuelo (UseContextTheme)</h1>
        {/* Fíjate que a 'BarraNavegacion' NO le pasamos props del tema */}
        <BarraNavegacion />
      </div>
    </ThemeContext>
  );
}


// Componente intermedio que NO le importa el tema
function BarraNavegacion() {
  return (
    <div className="m-5 p-5 border">
      <h2>Soy el Padre (Nav) - No uso el tema, solo contengo al hijo.</h2>
      <BotonConfiguracion />
    </div>
  );
}


// 3. EL CONSUMIDOR (Quien usa el hook)
function BotonConfiguracion() {
  // Aquí usamos el hook para "teletransportar" los datos desde el Abuelo
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <div className={`p-5 rounded ${theme === 'dark' ? 'bg-black text-white' : 'bg-gray-100 text-black'}`}>
      <h3>Soy el Nieto</h3>
      <p>El tema actual es: {theme}</p>
      <button 
        onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
        className="bg-blue-500 mt-2 px-3 py-1 rounded text-white"
      >
        Cambiar Tema
      </button>
    </div>
  );
}