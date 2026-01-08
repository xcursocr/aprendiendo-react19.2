import { createHttpClient } from "./httpClient";
import { tokenStore } from "./tokenStore";

export const apiClient = createHttpClient({
  baseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  getToken: () => tokenStore.get(),
});
