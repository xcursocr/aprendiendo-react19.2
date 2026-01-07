import { useEffect, useMemo, useReducer, useState, useTransition } from "react";

/**
 * Ajusta esto a tu API real.
 * Ej: Vite: import.meta.env.VITE_API_BASE_URL
 */
const API_BASE_URL = ""; // "" si mismo dominio; o "http://localhost:3000"

const TABLE = "products";

/**
 * Estado inicial de filtros (panel tipo Amazon)
 * - Usamos Sets para toggles (rápido + fácil)
 */
const initialFilters = {
  q: "",
  priceMin: "",
  priceMax: "",
  brandIds: new Set(),     // IDs (string o number en forma de string)
  categoryIds: new Set(),  // IDs
  colors: new Set(),       // strings
  sizes: new Set(),        // strings

  sortCol: "id",           // asegúrate que existe en tabla
  sortDir: "DESC",         // "ASC" | "DESC"

  page: 1,
  limit: 24,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_Q":
      return { ...state, q: action.value, page: 1 };

    case "SET_PRICE_MIN":
      return { ...state, priceMin: action.value, page: 1 };

    case "SET_PRICE_MAX":
      return { ...state, priceMax: action.value, page: 1 };

    case "TOGGLE_IN_SET": {
      const { key, value } = action; // key: "brandIds" | "categoryIds" | "colors" | "sizes"
      const next = new Set(state[key]);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return { ...state, [key]: next, page: 1 };
    }

    case "SET_SORT":
      return { ...state, sortCol: action.sortCol, sortDir: action.sortDir, page: 1 };

    case "SET_PAGE":
      return { ...state, page: action.value };

    case "CLEAR_ALL":
      return {
        ...initialFilters,
        limit: state.limit, // preserva limit si quieres
        sortCol: state.sortCol,
        sortDir: state.sortDir,
      };

    default:
      return state;
  }
}

/**
 * Construye query string compatible con tu backend (db.service.findAll):
 * - filtros simples como CSV: brand_id=1,2,3  category_id=...
 * - filtros avanzados en `filters` JSON: price BETWEEN, color IN, size IN
 * - sort: sort=col:ASC|DESC
 * - q: búsqueda global
 * - limit/offset
 */
function buildQueryString(f) {
  const params = new URLSearchParams();

  // paginación
  const offset = (f.page - 1) * f.limit;
  params.set("limit", String(f.limit));
  params.set("offset", String(offset));

  // sort (tu backend valida que la columna exista)
  if (f.sortCol) {
    params.set("sort", `${f.sortCol}:${f.sortDir}`);
  }

  // q
  if (f.q.trim()) params.set("q", f.q.trim());

  // filtros simples (CSV) -> IN automático en tu backend
  if (f.brandIds.size > 0) params.set("brand_id", Array.from(f.brandIds).join(","));
  if (f.categoryIds.size > 0) params.set("category_id", Array.from(f.categoryIds).join(","));

  // filtros avanzados
  const filters = {};

  // precio: BETWEEN "min,max" sobre columna "price"
  if (f.priceMin !== "" || f.priceMax !== "") {
    // puedes ajustar defaults
    const min = f.priceMin === "" ? "0" : String(f.priceMin);
    const max = f.priceMax === "" ? "999999999" : String(f.priceMax);
    filters.price = { between: `${min},${max}` };
  }

  // color/size: IN "a,b,c" (como strings)
  if (f.colors.size > 0) filters.color = { in: Array.from(f.colors).join(",") };
  if (f.sizes.size > 0) filters.size = { in: Array.from(f.sizes).join(",") };

  if (Object.keys(filters).length > 0) {
    params.set("filters", JSON.stringify(filters));
  }

  return params.toString();
}

/**
 * Helper para clonar Sets (para pasar de draft -> applied)
 */
function cloneFiltersWithSets(f) {
  return {
    ...f,
    brandIds: new Set(f.brandIds),
    categoryIds: new Set(f.categoryIds),
    colors: new Set(f.colors),
    sizes: new Set(f.sizes),
  };
}

export default function CatalogPage() {
  // Draft = lo que el usuario está editando
  const [draft, dispatch] = useReducer(reducer, initialFilters);

  // Applied = lo que realmente consulta a la API
  const [applied, setApplied] = useState(() => cloneFiltersWithSets(initialFilters));

  const [isPending, startTransition] = useTransition();

  const queryString = useMemo(() => buildQueryString(applied), [applied]);

  // Estado de datos
  const [result, setResult] = useState({
    items: [],
    meta: null,
    loading: false,
    error: null,
  });

  // Fetch datos cuando cambie applied (queryString)
  useEffect(() => {
    const controller = new AbortController();

    async function run() {
      setResult((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const url = `${API_BASE_URL}/api/v1/${TABLE}?${queryString}`;

        const res = await fetch(url, {
          signal: controller.signal,
          // Si usas cookies con CORS + credentials:
          // credentials: "include",
          headers: {
            "Content-Type": "application/json",
            // Si usas token en header:
            // Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();

        // Asumo tu sendSuccess: { data, meta, message, ok? }.
        // Ajusta según tu response.utils.js
        const items = json.data ?? [];
        const meta = json.meta ?? null;

        setResult({ items, meta, loading: false, error: null });
      } catch (e) {
        if (e.name === "AbortError") return;
        setResult((prev) => ({ ...prev, loading: false, error: e.message || "Error" }));
      }
    }

    run();
    return () => controller.abort();
  }, [queryString]);

  function applyFilters() {
    startTransition(() => {
      // Al aplicar, copiamos el draft actual a applied
      setApplied(cloneFiltersWithSets(draft));
    });
  }

  function clearFilters() {
    dispatch({ type: "CLEAR_ALL" });
    startTransition(() => setApplied(cloneFiltersWithSets(initialFilters)));
  }

  function changePage(nextPage) {
    // Paginar normalmente debe disparar fetch (o sea, actualizar applied.page)
    dispatch({ type: "SET_PAGE", value: nextPage });

    startTransition(() => {
      setApplied((prev) => ({ ...prev, page: nextPage }));
    });
  }

  function changeSort(sortCol, sortDir) {
    dispatch({ type: "SET_SORT", sortCol, sortDir });

    // Si quieres que el sort haga fetch inmediato, actualiza applied también:
    startTransition(() => {
      setApplied((prev) => ({ ...prev, sortCol, sortDir, page: 1 }));
    });
  }

  // Chips/resumen (derivado)
  const activeChips = useMemo(() => {
    const chips = [];
    if (draft.q.trim()) chips.push({ label: `Buscar: "${draft.q.trim()}"` });
    if (draft.priceMin !== "" || draft.priceMax !== "")
      chips.push({ label: `Precio: ${draft.priceMin || "0"} - ${draft.priceMax || "∞"}` });

    for (const id of draft.brandIds) chips.push({ label: `Marca #${id}` });
    for (const id of draft.categoryIds) chips.push({ label: `Categoría #${id}` });
    for (const c of draft.colors) chips.push({ label: `Color: ${c}` });
    for (const s of draft.sizes) chips.push({ label: `Talla: ${s}` });

    return chips;
  }, [draft]);

  const total = result.meta?.total ?? 0;
  const perPage = result.meta?.per_page ?? draft.limit;
  const currentPage = result.meta?.current_page ?? draft.page;
  const lastPage = result.meta?.last_page ?? 1;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 16, padding: 16 }}>
      <FilterSidebar
        state={draft}
        dispatch={dispatch}
        onApply={applyFilters}
        onClear={clearFilters}
        isApplying={isPending}
        activeChips={activeChips}
      />

      <main>
        <TopBar
          total={total}
          loading={result.loading || isPending}
          sortCol={draft.sortCol}
          sortDir={draft.sortDir}
          onChangeSort={changeSort}
        />

        {result.error && <p style={{ color: "crimson" }}>{result.error}</p>}

        <ProductGrid items={result.items} loading={result.loading || isPending} />

        <Pagination
          total={total}
          perPage={perPage}
          currentPage={currentPage}
          lastPage={lastPage}
          onPage={changePage}
          disabled={result.loading || isPending}
        />

        <pre style={{ marginTop: 16, background: "#111", color: "#0f0", padding: 12, borderRadius: 8 }}>
          Query actual: {queryString}
        </pre>
      </main>
    </div>
  );
}

/* =========================
   UI Components (simple)
========================= */

function FilterSidebar({ state, dispatch, onApply, onClear, isApplying, activeChips }) {
  // Esto normalmente vendría de tu API: /brands, /categories, etc.
  // Aquí pongo datos mock para el ejemplo.
  const brandOptions = [
    { id: "1", name: "Nike" },
    { id: "2", name: "Adidas" },
    { id: "3", name: "Puma" },
  ];

  const categoryOptions = [
    { id: "10", name: "Zapatos" },
    { id: "11", name: "Ropa" },
    { id: "12", name: "Accesorios" },
  ];

  const colorOptions = ["black", "white", "red", "blue"];
  const sizeOptions = ["S", "M", "L", "XL"];

  return (
    <aside style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
      <h3 style={{ marginTop: 0 }}>Filtros</h3>

      {activeChips.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
          {activeChips.map((c, idx) => (
            <span
              key={idx}
              style={{
                fontSize: 12,
                padding: "4px 8px",
                borderRadius: 999,
                background: "#f2f2f2",
              }}
            >
              {c.label}
            </span>
          ))}
        </div>
      )}

      <label style={{ display: "block", marginBottom: 12 }}>
        Buscar
        <input
          style={{ width: "100%" }}
          value={state.q}
          onChange={(e) => dispatch({ type: "SET_Q", value: e.target.value })}
          placeholder="Nombre, descripción..."
        />
      </label>

      <div style={{ marginBottom: 12 }}>
        <h4 style={{ margin: "8px 0" }}>Precio</h4>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            style={{ width: "50%" }}
            type="number"
            placeholder="Min"
            value={state.priceMin}
            onChange={(e) => dispatch({ type: "SET_PRICE_MIN", value: e.target.value })}
          />
          <input
            style={{ width: "50%" }}
            type="number"
            placeholder="Max"
            value={state.priceMax}
            onChange={(e) => dispatch({ type: "SET_PRICE_MAX", value: e.target.value })}
          />
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <h4 style={{ margin: "8px 0" }}>Marcas</h4>
        {brandOptions.map((b) => (
          <label key={b.id} style={{ display: "block" }}>
            <input
              type="checkbox"
              checked={state.brandIds.has(b.id)}
              onChange={() => dispatch({ type: "TOGGLE_IN_SET", key: "brandIds", value: b.id })}
            />
            {" "}{b.name}
          </label>
        ))}
      </div>

      <div style={{ marginBottom: 12 }}>
        <h4 style={{ margin: "8px 0" }}>Categorías</h4>
        {categoryOptions.map((c) => (
          <label key={c.id} style={{ display: "block" }}>
            <input
              type="checkbox"
              checked={state.categoryIds.has(c.id)}
              onChange={() => dispatch({ type: "TOGGLE_IN_SET", key: "categoryIds", value: c.id })}
            />
            {" "}{c.name}
          </label>
        ))}
      </div>

      <div style={{ marginBottom: 12 }}>
        <h4 style={{ margin: "8px 0" }}>Colores</h4>
        {colorOptions.map((c) => (
          <label key={c} style={{ display: "block" }}>
            <input
              type="checkbox"
              checked={state.colors.has(c)}
              onChange={() => dispatch({ type: "TOGGLE_IN_SET", key: "colors", value: c })}
            />
            {" "}{c}
          </label>
        ))}
      </div>

      <div style={{ marginBottom: 12 }}>
        <h4 style={{ margin: "8px 0" }}>Tallas</h4>
        {sizeOptions.map((s) => (
          <label key={s} style={{ display: "block" }}>
            <input
              type="checkbox"
              checked={state.sizes.has(s)}
              onChange={() => dispatch({ type: "TOGGLE_IN_SET", key: "sizes", value: s })}
            />
            {" "}{s}
          </label>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={onApply} disabled={isApplying} style={{ flex: 1 }}>
          {isApplying ? "Aplicando..." : "Aplicar"}
        </button>
        <button onClick={onClear} disabled={isApplying} style={{ flex: 1 }}>
          Limpiar
        </button>
      </div>
    </aside>
  );
}

function TopBar({ total, loading, sortCol, sortDir, onChangeSort }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
      <div>
        <strong>{total}</strong> resultados {loading ? "(cargando...)" : ""}
      </div>

      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <label>
          Ordenar por{" "}
          <select
            value={`${sortCol}:${sortDir}`}
            onChange={(e) => {
              const [col, dir] = e.target.value.split(":");
              onChangeSort(col, dir);
            }}
          >
            <option value="id:DESC">Más recientes (id desc)</option>
            <option value="price:ASC">Precio: menor a mayor</option>
            <option value="price:DESC">Precio: mayor a menor</option>
          </select>
        </label>
      </div>
    </div>
  );
}

function ProductGrid({ items, loading }) {
  if (loading && items.length === 0) return <p>Cargando productos...</p>;
  if (!loading && items.length === 0) return <p>No hay resultados.</p>;

  return (
    <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 12 }}>
      {items.map((p) => (
        <article key={p.id} style={{ border: "1px solid #eee", borderRadius: 8, padding: 12 }}>
          <div style={{ fontWeight: 700 }}>{p.name ?? `Producto #${p.id}`}</div>
          <div>Price: {p.price ?? "-"}</div>
          <div style={{ fontSize: 12, opacity: 0.7 }}>
            brand_id: {p.brand_id ?? "-"} | category_id: {p.category_id ?? "-"}
          </div>
        </article>
      ))}
    </div>
  );
}

function Pagination({ total, perPage, currentPage, lastPage, onPage, disabled }) {
  if (total === 0) return null;

  return (
    <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 16 }}>
      <button disabled={disabled || currentPage <= 1} onClick={() => onPage(currentPage - 1)}>
        Prev
      </button>
      <span>
        Página <strong>{currentPage}</strong> de <strong>{lastPage}</strong>
      </span>
      <button disabled={disabled || currentPage >= lastPage} onClick={() => onPage(currentPage + 1)}>
        Next
      </button>
    </div>
  );
}