/**
 En React 19.2, la gestión del Contexto se ha simplificado. 
 Ya no necesitamos envolvernos en Context.Consumer o preocuparnos tanto por las reglas de renderizado.
La clave aquí es usar el hook use(Context) para leer los datos.
Vamos a implementar un Sistema de Permisos (RBAC - Role Based Access Control).
Si eres Admin: Puedes ver el botón "Eliminar".
Si eres User: Solo puedes ver la lista.
 */
import { createContext, use, useState } from 'react';

// 1. Creamos el Contexto
const AuthContext = createContext(null);

// 2. El Provider (La "Nube" de datos)
export function AuthProvider({ children }) {
  // Estado simple: 'admin' o 'user'
  const [user, setUser] = useState({ name: 'Juan Dev', role: 'admin' });

  const toggleRole = () => {
    setUser(prev => ({
      ...prev,
      role: prev.role === 'admin' ? 'user' : 'admin'
    }));
  };

  return (
    // React 19: <Context> directo como provider
    <AuthContext value={{ user, toggleRole }}>
      {children}
      
      {/* WIDGET FLOTANTE PARA PRUEBAS (Solo para desarrollo) */}
      <div className="right-4 bottom-4 z-50 fixed bg-gray-800 hover:bg-gray-700 shadow-lg p-3 rounded-full text-white text-xs transition cursor-pointer" onClick={toggleRole}>
        Rol actual: <strong className="text-yellow-400 uppercase">{user.role}</strong>
        <div className="text-[10px] text-gray-400 text-center">(Click para cambiar)</div>
      </div>
    </AuthContext>
  );
}

// 3. Hook personalizado para consumir el contexto fácilmente
export function useAuth() {
  const context = use(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de un AuthProvider');
  return context;
}