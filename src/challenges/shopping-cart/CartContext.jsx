import { createContext, useContext, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  const addItem = (product) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === product.id);
      if (existingIndex !== -1) {
        return prev.map((item, idx) =>
          idx === existingIndex
            ? { ...item, qty: Math.min(10, item.qty + 1) }
            : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQty = (id, delta) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.id !== id) return item;
          const nextQty = item.qty + delta;
          if (nextQty <= 0) return null;
          return { ...item, qty: Math.min(10, nextQty) };
        })
        .filter(Boolean)
    );
  };

  const clearCart = () => setItems([]);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQty, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}