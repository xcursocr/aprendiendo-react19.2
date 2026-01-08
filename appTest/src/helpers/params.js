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




