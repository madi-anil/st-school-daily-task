import { products, formatINR } from "./products";
import { useCart } from "./CartContext";

export default function ProductGrid() {
  const { items, addItem } = useCart();

  return (
    <section>
      <h3>Products</h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))",
          gap: "1rem",
        }}
      >
        {products.map((product) => {
          const inCart = items.find((item) => item.id === product.id);
          const isMaxed = inCart?.qty >= 10;

          return (
            <div
              key={product.id}
              style={{
                border: "1px solid #444",
                borderRadius: "8px",
                padding: "1rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <small>{product.category} • ★ {product.rating}</small>
                <h4 style={{ margin: "0.4rem 0" }}>{product.name}</h4>
                <p style={{ fontWeight: "bold" }}>{formatINR(product.price)}</p>
              </div>

              <button
                type="button"
                disabled={isMaxed}
                onClick={() => addItem(product)}
              >
                {isMaxed
                  ? "Max Qty (10)"
                  : inCart
                  ? `Add More (${inCart.qty} in cart)`
                  : "Add to Cart"}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}