import { useCallback, useState } from "react";

export function useFileUpload({ onSuccess, onError }) {
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const uploadFile = useCallback(
    async (file) => {
      if (!file) return;

      // Generar preview si es imagen
      if (file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      }

      setIsUploading(true);
      setProgress(0);

      try {
        // FormData para multipart/form-data
        const formData = new FormData();
        formData.append("file", file);

        // Usamos fetch directo para tener control del progreso
        const xhr = new XMLHttpRequest();

        return new Promise((resolve, reject) => {
          xhr.upload.addEventListener("progress", (event) => {
            if (event.lengthComputable) {
              const percent = Math.round((event.loaded / event.total) * 100);
              setProgress(percent);
            }
          });

          xhr.addEventListener("load", () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              const res = JSON.parse(xhr.responseText);
              if (res.success) {
                onSuccess?.(res.data);
                resolve(res.data);
              } else {
                const err = new Error(res.message || "Error al subir archivo");
                onError?.(err);
                reject(err);
              }
            } else {
              const err = new Error(`HTTP ${xhr.status}`);
              onError?.(err);
              reject(err);
            }
            setIsUploading(false);
          });

          xhr.addEventListener("error", () => {
            const err = new Error("Error de red");
            onError?.(err);
            reject(err);
            setIsUploading(false);
          });

          // Enviar solicitud
          xhr.open(
            "POST",
            `${
              import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"
            }/api/v1/files/upload`
          );

          // Agregar token si es necesario
          const token = localStorage.getItem("auth_token");
          if (token) {
            xhr.setRequestHeader("Authorization", `Bearer ${token}`);
          }

          xhr.send(formData);
        });
      } catch (err) {
        onError?.(err);
        setIsUploading(false);
        setPreviewUrl(null);
      }
    },
    [onSuccess, onError]
  );

  const reset = useCallback(() => {
    setProgress(0);
    setIsUploading(false);
    setPreviewUrl(null);
  }, []);

  return {
    uploadFile,
    isUploading,
    progress,
    previewUrl,
    reset,
  };
}
