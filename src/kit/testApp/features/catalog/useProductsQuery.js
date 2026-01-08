import { useCallback, useMemo } from "react";
import { apiClient } from "../../api/client";
import { buildGenericQuery, createGenericApi } from "../../api/genericApi";
import { useGenericQuery } from "../../hooks/useGenericQuery";

const genericApi = createGenericApi({ http: apiClient });

export function useProductsQuery(appliedFilters) {
  const query = useMemo(() => {
    const offset = (appliedFilters.page - 1) * appliedFilters.limit;

    const advancedFilters = {};
    if (appliedFilters.priceMin || appliedFilters.priceMax) {
      advancedFilters.price = {
        between: `${appliedFilters.priceMin || 0},${
          appliedFilters.priceMax || 999999
        }`,
      };
    }
    if (appliedFilters.colors.size > 0) {
      advancedFilters.color = {
        in: Array.from(appliedFilters.colors).join(","),
      };
    }
    if (appliedFilters.sizes.size > 0) {
      advancedFilters.size = { in: Array.from(appliedFilters.sizes).join(",") };
    }

    return buildGenericQuery({
      limit: appliedFilters.limit,
      offset,
      sort: appliedFilters.sort,
      q: appliedFilters.q,
      include: ["brands", "categories"], // si hay FK
      simple: {
        category_id: appliedFilters.categoryIds,
        brand_id: appliedFilters.brandIds,
      },
      filters: advancedFilters,
    });
  }, [appliedFilters]);

  const queryFn = useCallback(
    ({ signal }) =>
      genericApi.findAll("products", query, { signal, tokenOptional: true }),
    [query]
  );

  return useGenericQuery({
    queryKey: ["products", query],
    queryFn,
    keepPreviousData: true,
  });
}
