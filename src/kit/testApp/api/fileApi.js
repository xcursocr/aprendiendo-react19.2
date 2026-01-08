import { apiClient } from "./client";

export function createFileApi() {
  return {
    async deleteFile(filename) {
      return apiClient.request(`/api/v1/files/${filename}`, {
        method: "DELETE",
      });
    },

    async listFiles() {
      // Si tienes un endpoint para listar archivos, úsalo aquí.
      // Si no, deberás implementar uno en backend.
      return apiClient.request(`/api/v1/files`, {
        method: "GET",
      });
    },
  };
}
