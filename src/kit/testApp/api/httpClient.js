const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
};

export function createHttpClient({ baseUrl, getToken }) {
  async function request(
    path,
    { method = "GET", query, body, signal, headers, tokenOptional = false } = {}
  ) {
    const url = new URL(path, baseUrl);

    // Query params
    if (query && typeof query === "object") {
      for (const [k, v] of Object.entries(query)) {
        if (v === undefined || v === null || v === "") continue;
        url.searchParams.set(k, String(v));
      }
    }

    // Token
    const token = getToken?.();
    const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

    // Si es GET y quieres que sea opcional (para tablas públicas)
    const optionalHeaders =
      tokenOptional && method === "GET" ? { "x-token-optional": "true" } : {};

    const res = await fetch(url.toString(), {
      method,
      signal,
      credentials: "include", // para CORS con cookies si las usas
      headers: {
        ...DEFAULT_HEADERS,
        ...authHeaders,
        ...optionalHeaders,
        ...headers,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });

    const contentType = res.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");
    const payload = isJson ? await res.json() : await res.text();

    // Tu backend siempre responde con { success, message, data, meta, error }
    if (!res.ok || !payload.success) {
      const err = new Error(payload?.message || `HTTP ${res.status}`);
      err.status = res.status;
      err.code = payload?.error || "UNKNOWN_ERROR";
      err.payload = payload;
      throw err;
    }

    return payload; // { success: true, data, meta, message }
  }

  return { request };
}
