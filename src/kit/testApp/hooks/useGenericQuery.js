import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Hook genérico para queries con AbortController y keepPreviousData
 */
export function useGenericQuery({
  queryKey,
  queryFn,
  enabled = true,
  keepPreviousData = true,
}) {
  const [state, setState] = useState({
    data: null,
    meta: null,
    loading: false,
    error: null,
  });

  const lastKeyRef = useRef(null);

  const key = useMemo(() => {
    return typeof queryKey === "string" ? queryKey : JSON.stringify(queryKey);
  }, [queryKey]);

  useEffect(() => {
    if (!enabled) return;
    if (lastKeyRef.current === key) return;
    lastKeyRef.current = key;

    const controller = new AbortController();

    setState((prev) => ({
      data: keepPreviousData ? prev.data : null,
      meta: keepPreviousData ? prev.meta : null,
      loading: true,
      error: null,
    }));

    Promise.resolve()
      .then(() => queryFn({ signal: controller.signal }))
      .then((res) => {
        // Tu backend: { success: true, data, meta, message }
        setState({
          data: res.data ?? null,
          meta: res.meta ?? null,
          loading: false,
          error: null,
        });
      })
      .catch((e) => {
        if (e?.name === "AbortError") return;
        setState((prev) => ({
          ...prev,
          loading: false,
          error: e?.message || "Error desconocido",
        }));
      });

    return () => controller.abort();
  }, [key, enabled, keepPreviousData, queryFn]);

  return state;
}
