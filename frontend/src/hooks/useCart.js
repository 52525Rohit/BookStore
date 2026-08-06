import { useCallback, useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export default function useCart() {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/cart/`);
      setCart(res.data.cart || { items: [] });
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const updateItem = async (bookId, quantity) => {
    const res = await axios.put(`${API}/cart/update/${bookId}`, { quantity });
    setCart(res.data.cart);
  };

  const removeItem = async (bookId) => {
    const res = await axios.delete(`${API}/cart/remove/${bookId}`);
    setCart(res.data.cart);
  };

  const total = (cart.items || []).reduce(
    (sum, item) => sum + (item.book?.price || 0) * item.quantity,
    0
  );

  return { cart, loading, error, refresh, updateItem, removeItem, total };
}
