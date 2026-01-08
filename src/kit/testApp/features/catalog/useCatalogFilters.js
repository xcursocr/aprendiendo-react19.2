import { useMemo, useReducer } from "react";

const initialState = {
  q: "",
  categoryIds: new Set(),
  brandIds: new Set(),
  colors: new Set(),
  sizes: new Set(),
  priceMin: "",
  priceMax: "",
  sort: "id:DESC",
  page: 1,
  limit: 24,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_Q":
      return { ...state, q: action.value, page: 1 };
    case "TOGGLE_CATEGORY": {
      const next = new Set(state.categoryIds);
      next.has(action.value)
        ? next.delete(action.value)
        : next.add(action.value);
      return { ...state, categoryIds: next, page: 1 };
    }
    case "TOGGLE_BRAND": {
      const next = new Set(state.brandIds);
      next.has(action.value)
        ? next.delete(action.value)
        : next.add(action.value);
      return { ...state, brandIds: next, page: 1 };
    }
    case "TOGGLE_COLOR": {
      const next = new Set(state.colors);
      next.has(action.value)
        ? next.delete(action.value)
        : next.add(action.value);
      return { ...state, colors: next, page: 1 };
    }
    case "TOGGLE_SIZE": {
      const next = new Set(state.sizes);
      next.has(action.value)
        ? next.delete(action.value)
        : next.add(action.value);
      return { ...state, sizes: next, page: 1 };
    }
    case "SET_PRICE_MIN":
      return { ...state, priceMin: action.value, page: 1 };
    case "SET_PRICE_MAX":
      return { ...state, priceMax: action.value, page: 1 };
    case "SET_SORT":
      return { ...state, sort: action.value, page: 1 };
    case "SET_PAGE":
      return { ...state, page: action.value };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

export function useCatalogFilters() {
  const [filters, dispatch] = useReducer(reducer, initialState);

  const activeCount = useMemo(() => {
    let count = 0;
    if (filters.q) count++;
    count += filters.categoryIds.size;
    count += filters.brandIds.size;
    count += filters.colors.size;
    count += filters.sizes.size;
    if (filters.priceMin || filters.priceMax) count++;
    return count;
  }, [filters]);

  return { filters, dispatch, activeCount };
}
