import {
  cache, // 🔥 1. IMPORTAR CACHE
  Component,
  Suspense,
  use,
  useActionState,
  useOptimistic
} from 'react';
import { preload, useFormStatus } from 'react-dom'; // 🔥 2. IMPORTAR PRELOAD

// ==========================================
// 0. CONFIGURACIÓN GLOBAL (Preload)
// ==========================================
// 🔥 Esto inicia la descarga inmediatamente, antes de pintar nada.
preload('https://cdn.jsdelivr.net/npm/@fontsource/inter/files/inter-latin-400-normal.woff2', { as: 'font' });

// ==========================================
// 1. CAPA DE SERVICIO (Con Cache)
// ==========================================
const api = {
  // 🔥 Envolvemos el fetch en cache(). 
  // Ahora podemos llamar a getStats() en 20 componentes distintos y solo hará 1 petición.
  getStats: cache(async () => {
    console.log("📡 FETCHING STATS (Si ves esto 2 veces, el caché falló)");
    await new Promise(r => setTimeout(r, 800));
    return { visitors: 1200, sales: 450 };
  }),

  getProducts: cache(async () => { 
    await new Promise(r => setTimeout(r, 1000)); 
    return [{ id: 1, title: "Monitor 4K", price: 300 }, { id: 2, title: "Mouse Gamer", price: 50 }]; 
  }),

  create: async (p, fd) => { 
    await new Promise(r => setTimeout(r, 800)); 
    return { success: true, data: { id: Date.now(), title: fd.get('title'), price: 0 } }; 
  },
  delete: async (id) => { await new Promise(r => setTimeout(r, 500)); return true; }
};

// ==========================================
// 2. TOOLKIT (AsyncView, SmartForm...)
// ==========================================
// (Se mantiene igual que antes, resumido para brevedad)
class ErrorBoundary extends Component {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  render() { if (this.state.hasError) return <div>Error <button onClick={this.props.onReset}>Retry</button></div>; return this.props.children; }
}
function AsyncView({ children, onRetry }) {
  return <ErrorBoundary onReset={onRetry}><Suspense fallback={<div className="p-10 text-center animate-pulse">Cargando...</div>}>{children}</Suspense></ErrorBoundary>;
}
function SmartForm({ action, onSuccess, children }) {
  const [state, formAction] = useActionState(async (p, f) => {
    const res = await action(p, f);
    if (res?.success && onSuccess) onSuccess(res.data);
    return res;
  }, null);
  return <form action={formAction} className="flex gap-2">{children}</form>;
}
function useOptimisticList(realItems) {
  const [optimisticItems, setOptimistic] = useOptimistic(realItems, (current, action) => {
      if (action.type === 'add') return [...current, { ...action.item, sending: true }];
      if (action.type === 'remove') return current.filter(i => i.id !== action.id);
      return current;
  });
  return { items: optimisticItems, add: (item) => setOptimistic({ type: 'add', item }), remove: (id) => setOptimistic({ type: 'remove', id }) };
}
// -------------------

// ==========================================
// 3. DASHBOARD INTEGRADO
// ==========================================

export default function DashboardPage() {
  const productsPromise = api.getProducts();
  const statsPromise = api.getStats(); // Primera llamada a stats

  return (
    <div className="mx-auto p-8 max-w-3xl font-sans text-gray-800">
      {/* 🔥 METADATA NATIVA: Cambiamos el título de la pestaña */}
      <title>Dashboard | React 19 Starter Kit</title>
      <meta name="description" content="Panel de control administrativo avanzado" />

      <h1 className="mb-6 font-bold text-indigo-900 text-3xl">Dashboard Pro</h1>

      {/* SECCIÓN DE ESTADÍSTICAS (Usa cache) */}
      <AsyncView>
        <div className="gap-4 grid grid-cols-2 mb-8">
           <StatCard title="Visitantes" promise={statsPromise} type="visitors" />
           {/* Aquí pasamos la promesa de nuevo, pero gracias a cache(), no se repite la lógica interna */}
           <StatCard title="Ventas Totales" promise={statsPromise} type="sales" />
        </div>
      </AsyncView>

      <AsyncView>
        <ProductManager promise={productsPromise} />
      </AsyncView>
    </div>
  );
}

// Componente que consume la promesa de estadísticas
function StatCard({ title, promise, type }) {
  const stats = use(promise); // Consume la data
  
  return (
    <div className="bg-white shadow p-4 border border-gray-100 rounded">
      <h3 className="text-gray-500 text-sm">{title}</h3>
      <p className="font-bold text-indigo-600 text-2xl">{stats[type]}</p>
    </div>
  );
}

function ProductManager({ promise }) {
  const products = use(promise);
  const { items, add, remove } = useOptimisticList(products);

  return (
    <div className="bg-white shadow-sm p-4 border border-gray-200 rounded-xl">
      <h2 className="mb-4 font-bold">Inventario ({items.length})</h2>
      
      {/* 🔥 METADATA DINÁMICA: Si hay pocos productos, cambiamos el título para alertar */}
      {items.length < 3 && <title>⚠️ Stock Bajo | Dashboard</title>}

      <SmartForm action={api.create} onSuccess={d => console.log(d)}>
        <input name="title" placeholder="Nuevo producto..." className="flex-1 p-2 border rounded" />
        <SaveButtonWithPreload add={add} />
      </SmartForm>

      <ul className="space-y-2 mt-4">
        {items.map(p => (
          <li key={p.id} className={`flex justify-between p-2 border-b ${p.sending ? 'opacity-50' : ''}`}>
            {p.title}
            <button onClick={async () => { remove(p.id); await api.delete(p.id); }} className="text-red-500 text-sm">
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SaveButtonWithPreload({ add }) {
  const { pending } = useFormStatus();
  
  // 🔥 PRELOAD INTERACTIVO: 
  // Cuando el usuario pasa el mouse por "Guardar", precargamos la imagen de "Éxito"
  // que saldría en un modal o notificación futura.
  const handleMouseEnter = () => {
    preload('/images/success-confetti.png', { as: 'image' });
  };

  return (
    <div onMouseEnter={handleMouseEnter}>
      <button 
        onClick={(e) => {
          // Lógica Optimista manual para el demo
          const form = e.target.closest('form');
          const title = form.querySelector('[name="title"]').value;
          if (title) { add({ id: Math.random(), title, price: 0 }); form.reset(); }
        }}
        disabled={pending} 
        className="bg-indigo-600 px-4 py-2 rounded text-white"
      >
        {pending ? '...' : 'Guardar'}
      </button>
    </div>
  );
}