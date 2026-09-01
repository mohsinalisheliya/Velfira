import { createContext, useContext, useState, useEffect, useCallback } from "react";
import * as cartApi from "../api/cart";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isLoggedIn } = useAuth();
  const [cart, setCart] = useState({ items: [], item_count: 0, total: 0 });
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!isLoggedIn) return;
    setLoading(true);
    try {
      const { data } = await cartApi.getCart();
      setCart(data);
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addItem = async (product_id, quantity = 1, variant_id = null) => {
    const { data } = await cartApi.addToCart(product_id, quantity, variant_id);
    setCart(data);
  };

  const updateItem = async (item_id, quantity) => {
    const { data } = await cartApi.updateCartItem(item_id, quantity);
    setCart(data);
  };

  const removeItem = async (item_id) => {
    const { data } = await cartApi.removeCartItem(item_id);
    setCart(data);
  };

  return (
    <CartContext.Provider value={{ cart, loading, addItem, updateItem, removeItem, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);