/**
 * 
Metadata Nativa (<title>, <meta>)
El Problema: Antes, para cambiar el título de la pestaña del navegador (document.title) desde un componente hijo, 
necesitabas librerías pesadas como react-helmet. React 19: React sabe "elevar" (hoist) estas etiquetas automáticamente al 
<head> del HTML, sin importar dónde las escribas.
 */
export function ProductPage({ product }) {
  return (
    <article>
      {/* ¡Esto funciona mágicamente! React lo mueve al <head> */}
      <title>{product.name} | Mi Tienda</title>
      <meta name="description" content={`Compra ${product.name} al mejor precio.`} />
      
      <h1>{product.name}</h1>
      <p>{product.description}</p>
    </article>
  );
}