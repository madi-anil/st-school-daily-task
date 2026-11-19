import { useState } from "react";
import { useCart } from "./CartContext";
import { formatINR } from "./products";

export default function CartPanel() {
  const { items, updateQty, removeItem, clearCart } = useCart();
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [couponError, setCouponError] = useState("");

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discount = appliedCoupon === "SAVE10" ? subtotal * 0.1 : 0;
  const taxableAmount = subtotal - discount;
  const gst = taxableAmount * 0.18;
  const grandTotal = taxableAmount + gst;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const code = couponInput.trim().toUpperCase();
    if (!code) return;

    if (code === "SAVE10") {
      setAppliedCoupon("SAVE10");
      setCouponError("");
    } else {
      setAppliedCoupon("");
      setCouponError("Invalid coupon");
    }
  };

  return (
    <aside
      style={{
        border: "1px solid #34b232",
        borderRadius: "8px",
        padding: "1rem",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3>Your Cart</h3>
        {items.length > 0 && (
          <button type="button" onClick={clearCart}>
            Clear Cart
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {items.map((item) => (
              <li
                key={item.id}
                style={{
                  borderBottom: "1px solid #3417c2",
                  padding: "0.75rem 0",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <strong>{item.name}</strong>
                  <span>{formatINR(item.price * item.qty)}</span>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginTop: "0.5rem",
                  }}
                >
                  <button type="button" onClick={() => updateQty(item.id, -1)}>
                    -
                  </button>
                  <span>{item.qty}</span>
                  <button
                    type="button"
                    disabled={item.qty >= 10}
                    onClick={() => updateQty(item.id, 1)}
                  >
                    +
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    style={{ marginLeft: "auto" }}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <form onSubmit={handleApplyCoupon} style={{ margin: "1rem 0" }}>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                type="text"
                placeholder="Coupon (try SAVE10)"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
              />
              <button type="submit">Apply</button>
            </div>
            {couponError && <p role="alert" style={{ color: "tomato" }}>{couponError}</p>}
            {appliedCoupon && <p style={{ color: "lightgreen" }}>SAVE10 applied (10% off)</p>}
          </form>

          <div>
            <p>Subtotal: {formatINR(subtotal)}</p>
            {discount > 0 && <p>Discount (10%): -{formatINR(discount)}</p>}
            <p>GST (18%): {formatINR(gst)}</p>
            <h4>Grand Total: {formatINR(grandTotal)}</h4>
          </div>
        </>
      )}
    </aside>
  );
}