// src/features/product/ProductForm.jsx
import { useState } from "react";
import FileUploader from "../../components/FileUploader";

export default function ProductForm() {
  const [formData, setFormData] = useState({ name: "", price: "", image: "" });

  function handleImageUpload(data) {
    // data = { filename, url, mimetype, size }
    setFormData((prev) => ({ ...prev, image: data.filename }));
  }

  return (
    <form>
      <input
        placeholder="Nombre del producto"
        value={formData.name}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, name: e.target.value }))
        }
      />
      <input
        type="number"
        placeholder="Precio"
        value={formData.price}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, price: e.target.value }))
        }
      />

      <h4>Imagen principal</h4>
      <FileUploader onUploadComplete={handleImageUpload} />

      <button type="submit">Guardar producto</button>
    </form>
  );
}
