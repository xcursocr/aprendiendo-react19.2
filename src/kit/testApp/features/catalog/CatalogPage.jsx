// src/features/catalog/CatalogPage.jsx
import { useState, useTransition } from "react";
import { useCatalogFilters } from "./useCatalogFilters";
import { useProductsQuery } from "./useProductsQuery";

export default function CatalogPage() {
  const { filters: draft, dispatch, activeCount } = useCatalogFilters();
  const [applied, setApplied] = useState(draft);
  const [isPending, startTransition] = useTransition();

  const { data, meta, loading, error } = useProductsQuery(applied);

  function applyFilters() {
    startTransition(() => setApplied({ ...draft }));
  }

  function clearFilters() {
    dispatch({ type: "RESET" });
    startTransition(() => setApplied({ ...draft }));
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 16 }}>
      <aside>
        <h3>Filtros ({activeCount})</h3>
        <input
          placeholder="Buscar..."
          value={draft.q}
          onChange={(e) => dispatch({ type: "SET_Q", value: e.target.value })}
        />
        {/* Más filtros aquí */}
        <button onClick={applyFilters} disabled={isPending}>
          {isPending ? "Aplicando..." : "Aplicar"}
        </button>
        <button onClick={clearFilters}>Limpiar</button>
      </aside>

      <main>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {loading && <p>Cargando...</p>}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 12,
          }}
        >
          {data?.map((p) => (
            <div key={p.id} style={{ border: "1px solid #ddd", padding: 12 }}>
              <h4>{p.name}</h4>
              <p>${p.price}</p>
            </div>
          ))}
        </div>
        {meta && <p>Total: {meta.total} productos</p>}
      </main>
    </div>
  );
}
