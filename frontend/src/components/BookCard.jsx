import React from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";

function BookCard({ item }) {
  const { authUser } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = async (book) => {
    if (!authUser) {
      toast.error("Please login to add items to your cart.");

      navigate("/signup");

      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/cart/add`,
        { bookId: book._id },
      );

      toast.success(response.data.message || "Book added to cart!");
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.message || "Could not add to cart.");
    }
  };

  return (
    <div className="card bg-base-100 w-full shadow-xl hover:scale-105 duration-200 dark:bg-slate-900 dark:text-white dark:border">
      <figure>
        <img
          src={item.image}
          alt={item.name}
          className="h-60 w-full object-cover"
        />
      </figure>

      <div className="card-body p-4">
        <h2 className="card-title">
          {item.name}
          <div className="badge badge-secondary">{item.category}</div>
        </h2>

        <p className="text-sm">{item.title}</p>

        <div className="card-actions justify-between items-center mt-2">
          <div className="badge badge-outline">₹{item.price}</div>

          <button
            type="button"
            onClick={() => handleAddToCart(item)}
            className="cursor-pointer px-3 py-2 rounded-full border-2 hover:bg-pink-500 hover:text-white duration-200"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookCard;
