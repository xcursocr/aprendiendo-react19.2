// <-- Tus formularios
/**
 El Problema: Escribir useActionState, manejar errores, 
 y crear botones disabled para cada formulario es repetitivo. 
 Tu Solución: Un componente que encapsula la lógica de React 19.2.
 */
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

/**
 * @param {Function} action - La Server Action (async function)
 * @param {Function} onSuccess - Callback cuando todo sale bien
 * @param {Object} initialData - Datos para editar (opcional)
 */
export function SmartForm({ action, onSuccess, children, className }) {
  
  // Wrapper para interceptar el éxito
  const actionWrapper = async (prevState, formData) => {
    const result = await action(prevState, formData);
    if (result?.success && onSuccess) {
      onSuccess(result.data);
    }
    return result; // { success: true/false, error: '...', data: ... }
  };

  const [state, formAction] = useActionState(actionWrapper, null);

  return (
    <form action={formAction} className={className}>
      {state?.error && (
        <div className="bg-red-100 mb-4 p-3 rounded font-bold text-red-600 text-sm">
          ⚠️ {state.error}
        </div>
      )}
      {children}
    </form>
  );
}

// Botón que se bloquea solo
export function SubmitBtn({ label = "Guardar", loadingLabel = "Guardando..." }) {
  const { pending } = useFormStatus();
  return (
    <button 
      disabled={pending} 
      className="bg-blue-600 disabled:opacity-50 px-4 py-2 rounded text-white disabled:cursor-not-allowed"
    >
      {pending ? loadingLabel : label}
    </button>
  );
}

// ¿Cómo lo usas?
/**
 // Login, Registro, Crear Producto... todo usa lo mismo:
<SmartForm action={api.login} onSuccess={() => router.push('/dashboard')}>
   <input name="email" className="..." />
   <input name="password" className="..." />
   <SubmitBtn label="Entrar" />
</SmartForm>
 */