import SEO from "../kit/SeoHead";

export default function ProductPage({ product }) {

  return (
    <>
      <SEO title="Inicio" />
      <article>
        <h1>{product?.name}</h1>
        <p>{product?.description}</p>
        <h2>Page products</h2>
       
      </article>
    </>
  );
}
