// <-- Tu arquitectura

/**
 El Problema: En cada página tienes que repetir: Suspense, ErrorBoundary, Fallback, etc. 
 Tu Solución: Un componente que envuelve ese patrón "Sandwich".
 */

import { Suspense } from 'react';
import { ErrorBoundary } from './ErrorBoundary'; // Tu clase que vimos antes

/**
 * @param {Promise} dataPromise - La promesa que estamos esperando (usada dentro por children)
 * @param {ReactNode} children - El componente que hace `use(promise)`
 * @param {ReactNode} fallback - Lo que se muestra mientras carga (Skeleton)
 * @param {ReactNode} errorFallback - (Opcional) UI personalizada de error
 */
export function AsyncView({ children, fallback, onRetry }) {
  return (
    <ErrorBoundary onReset={onRetry}>
      <Suspense fallback={fallback || <div className="p-4 animate-pulse">Cargando...</div>}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}

// ¿Cómo lo usas en tus proyectos? ¡Mira qué limpio queda ahora tu código!

/**
// En cualquier página de cualquier proyecto:
const productsPromise = api.getProducts();

export default function Page() {
  return (
    <AsyncView 
      fallback={<ProductsSkeleton />} 
      onRetry={() => window.location.reload()}
    >
      <ProductList promise={productsPromise} />
    </AsyncView>
  );
}
 */