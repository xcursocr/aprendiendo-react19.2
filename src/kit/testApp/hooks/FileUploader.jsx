import { useCallback, useState } from "react";
import { useFileUpload } from "../hooks/useFileUpload";

export default function FileUploader({ onUploadComplete }) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);

  const { uploadFile, isUploading, progress, previewUrl, reset } =
    useFileUpload({
      onSuccess: (data) => {
        onUploadComplete?.(data);
        setError(null);
      },
      onError: (err) => {
        setError(err.message || "Error al subir archivo");
      },
    });

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        uploadFile(e.dataTransfer.files[0]);
      }
    },
    [uploadFile]
  );

  const onChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      uploadFile(e.target.files[0]);
    }
  };

  const onDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  return (
    <div
      style={{
        border: dragActive ? "2px dashed #007bff" : "2px dashed #ccc",
        borderRadius: 8,
        padding: 24,
        textAlign: "center",
        backgroundColor: "#fafafa",
        position: "relative",
      }}
      onDragEnter={onDragEnter}
      onDragOver={(e) => e.preventDefault()}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <input
        type="file"
        accept="image/*"
        onChange={onChange}
        style={{ display: "none" }}
        id="file-upload-input"
      />

      {previewUrl ? (
        <div>
          <img
            src={previewUrl}
            alt="Preview"
            style={{ maxWidth: "100%", maxHeight: 200, marginBottom: 12 }}
          />
          <button onClick={reset}>Cambiar imagen</button>
        </div>
      ) : (
        <label htmlFor="file-upload-input" style={{ cursor: "pointer" }}>
          <p>Arrastra una imagen aquí o haz clic para seleccionar</p>
          <em>(Formatos: JPG, PNG, GIF - Máximo 5MB)</em>
        </label>
      )}

      {isUploading && (
        <div style={{ marginTop: 16 }}>
          <progress value={progress} max="100" style={{ width: "100%" }} />
          <small>{progress}%</small>
        </div>
      )}

      {error && <p style={{ color: "red", marginTop: 12 }}>{error}</p>}
    </div>
  );
}
