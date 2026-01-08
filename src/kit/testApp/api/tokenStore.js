const KEY = "auth_token";

export const tokenStore = {
  get() {
    return localStorage.getItem(KEY);
  },
  set(token) {
    localStorage.setItem(KEY, token);
  },
  clear() {
    localStorage.removeItem(KEY);
  },
};
