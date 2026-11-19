import { useCart } from "./CartContext";

export default function Navbar() {
  const { items } = useCart();
  const totalCount = items.reduce((sum, item) => sum + item.qty, 0);

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem",
        borderBottom: "1px solid #47ce74",
        marginBottom: "1.5rem",
      }}
    >
      <h2 style={{ margin: 0 }}>Mini Store</h2>
      <div style={{ fontWeight: "bold", fontSize: "1.1rem" }}>
        Cart: <span>{totalCount}</span> {totalCount === 1 ? "item" : "items"}
      </div>
    </header>
  );
}