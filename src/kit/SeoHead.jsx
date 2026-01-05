/**
 * Componente SEO Reutilizable para React 19.2
 * @param {string} title - Título específico de la página
 * @param {string} description - Descripción para Google
 * @param {string} image - (Opcional) Imagen para compartir en redes (OG Image)
 */

export default function SEO({ title, description, keywords, ogImage }) {
  // Definimos el título base una sola vez
  const siteTitle = "Basculas Rodríguez Nicaragua";
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const defaultImage = "/images/og-default.jpg";

  return (
    <>
      {/* 1. Título y Descripción Estándar */}
      {/* React 19 moverá esto automáticamente al <head> */}
      <title>
        {fullTitle || "Basculas Rodriguez Nicaragua | Calidad que Pesa"}
      </title>
      <meta
        name="description"
        content={
          description ||
          "Expertos en venta, reparación y mantenimiento de básculas en Nicaragua. Técnicos certificados con años de experiencia. Diagnóstico gratis y stock completo de repuestos"
        }
      />
      <meta name="author" content="Basculas Rodriguez Nicaragua" />
      {/* 2. Palabras Clave (Renderizado Condicional Limpio) */}
      {keywords && (
        <meta
          name="keywords"
          content={
            keywords ||
            "básculas Nicaragua, reparación básculas, venta básculas, mantenimiento básculas, básculas industriales, balanzas Nicaragua"
          }
        />
      )}

      {/* 3. Open Graph (Facebook, WhatsApp, LinkedIn) */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://bascularodriguez.com" />
      {ogImage && (
        <meta property="og:image" content={ogImage || defaultImage} />
      )}

      {/* 4. Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {ogImage && (
        <meta name="twitter:image" content={ogImage || defaultImage} />
      )}

      {/* Links */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com"  />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />
    </>
  );
}
