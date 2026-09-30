import { API } from "../api";
import { useEffect, useState } from "react";
import axios from "axios";

export default function useBooks(filterFn) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    const getBooks = async () => {
      try {
        const res = await axios.get(`${API}/book`);
        if (!active) return;
        setBooks(filterFn ? res.data.filter(filterFn) : res.data);
      } catch (err) {
        if (active) setError(err);
      } finally {
        if (active) setLoading(false);
      }
    };
    getBooks();
    return () => {
      active = false;
    };
  }, []);

  return { books, loading, error };
}
