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