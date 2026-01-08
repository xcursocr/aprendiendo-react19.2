import { useEffect, useState } from "react";
import { createFileApi } from "../api/fileApi";

const fileApi = createFileApi();

export default function FileGallery() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Carga inicial de archivos
  useEffect(() => {
    setLoading(true);
    fileApi
      .listFiles()
      .then((res) => {
        setFiles(res.data || []);
        setError(null);
      })
      .catch((err) => setError(err.message || "Error al cargar archivos"))
      .finally(() => setLoading(false));
  }, []);

  // Eliminar archivo
  const handleDelete = async (filename) => {
    if (!window.confirm("¿Eliminar este archivo?")) return;
    try {
      await fileApi.deleteFile(filename);
      setFiles((prev) => prev.filter((f) => f.filename !== filename));
    } catch (err) {
      alert(err.message || "Error al eliminar archivo");
    }
  };

  if (loading) return <p>Cargando archivos...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (files.length === 0) return <p>No hay archivos subidos.</p>;

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
      {files.map(({ filename, url, mimetype }) => (
        <div
          key={filename}
          style={{ border: "1px solid #ccc", padding: 8, width: 150 }}
        >
          {mimetype.startsWith("image/") ? (
            <img
              src={url}
              alt={filename}
              style={{ width: "100%", height: "auto" }}
            />
          ) : (
            <p>{filename}</p>
          )}
          <button
            onClick={() => handleDelete(filename)}
            style={{ marginTop: 8, width: "100%" }}
          >
            Eliminar
          </button>
        </div>
      ))}
    </div>
  );
}
