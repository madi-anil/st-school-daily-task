import { CartProvider } from "./CartContext";
import Navbar from "./Header";
import ProductGrid from "./ProductGrid";
import CartPanel from "./CartPanel";

export default function ShoppingCartApp() {
  return (
    <CartProvider>
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "1rem" }}>
        <Navbar />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "1.5rem",
            alignItems: "start",
          }}
        >
          <ProductGrid />
          <CartPanel />
        </div>
      </div>
    </CartProvider>
  );
}