function setToCSV(set) {
  if (!set || set.size === 0) return undefined;
  return Array.from(set).join(",");
}

/**
 * Construye query compatible con tu backend (db.service.findAll)
 */
export function buildGenericQuery({
  limit,
  offset,
  sort, // "price:ASC"
  include, // Set|array|string
  q,
  simple, // { category_id: Set|array, brand_id: ... }
  filters, // { price: { between: "10,200" }, color: { in: "red,blue" } }
  group,
  aggregate, // { func: "COUNT", col: "id" }
  exclude,
} = {}) {
  const query = {};

  if (limit != null) query.limit = limit;
  if (offset != null) query.offset = offset;
  if (sort) query.sort = sort;
  if (q) query.q = q;
  if (exclude) query.exclude = exclude;
  if (group) query.group = group;

  // include (JOIN por FK)
  if (include) {
    if (typeof include === "string") query.include = include;
    else if (include instanceof Set)
      query.include = Array.from(include).join(",");
    else if (Array.isArray(include)) query.include = include.join(",");
  }

  // filtros simples (CSV -> IN automático)
  if (simple && typeof simple === "object") {
    for (const [key, value] of Object.entries(simple)) {
      if (value instanceof Set) query[key] = setToCSV(value);
      else if (Array.isArray(value)) query[key] = value.join(",");
      else if (value != null && value !== "") query[key] = value;
    }
  }

  // filtros avanzados (JSON)
  if (filters && Object.keys(filters).length > 0) {
    query.filters = JSON.stringify(filters);
  }

  // aggregate (tu backend parsea el nombre del param)
  if (aggregate?.func && aggregate?.col) {
    query[`aggregate:${aggregate.func}:${aggregate.col}`] = "1";
  }

  return query;
}

export function createGenericApi({ http }) {
  return {
    async findAll(table, query, { signal, tokenOptional = false } = {}) {
      return http.request(`/api/v1/${table}`, { query, signal, tokenOptional });
    },

    async getById(table, id, { signal, tokenOptional = false } = {}) {
      return http.request(`/api/v1/${table}/${id}`, { signal, tokenOptional });
    },

    async getBySlug(table, slug, { signal, tokenOptional = false } = {}) {
      return http.request(`/api/v1/${table}/slug/${slug}`, {
        signal,
        tokenOptional,
      });
    },

    async isAvailable(table, payload, { signal } = {}) {
      return http.request(`/api/v1/${table}/is-available`, {
        method: "POST",
        body: payload,
        signal,
      });
    },

    async create(table, data, { signal } = {}) {
      return http.request(`/api/v1/${table}`, {
        method: "POST",
        body: data,
        signal,
      });
    },

    async update(table, id, data, { signal } = {}) {
      return http.request(`/api/v1/${table}/${id}`, {
        method: "PUT",
        body: data,
        signal,
      });
    },

    async delete(table, id, { signal } = {}) {
      return http.request(`/api/v1/${table}/${id}`, {
        method: "DELETE",
        signal,
      });
    },
  };
}
