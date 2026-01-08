export function createAuthApi({ http }) {
  return {
    async login(credentials) {
      // POST /api/v1/auth/login
      return http.request("/api/v1/auth/login", {
        method: "POST",
        body: credentials, // { email, password }
      });
    },

    async register(userData) {
      // POST /api/v1/auth/register
      return http.request("/api/v1/auth/register", {
        method: "POST",
        body: userData,
      });
    },

    async getProfile({ signal } = {}) {
      // GET /api/v1/auth/profile (requiere token)
      return http.request("/api/v1/auth/profile", { signal });
    },

    async refreshToken(refreshToken) {
      // POST /api/v1/auth/refresh-token
      return http.request("/api/v1/auth/refresh-token", {
        method: "POST",
        body: { refreshToken },
      });
    },
  };
}
