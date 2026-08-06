import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "./Navbar";
import Footer from "./Footer";
import useCart from "../hooks/useCart";

function Cart() {
  const { cart, loading, error, updateItem, removeItem, total } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = async (bookId, quantity) => {
    if (quantity < 1) return;
    try {
      await updateItem(bookId, quantity);
    } catch (err) {
      toast.error(err.response?.data?.message || "Couldn't update quantity");
    }
  };

  const handleRemove = async (bookId) => {
    try {
      await removeItem(bookId);
      toast.success("Removed from cart");
    } catch (err) {
      toast.error(err.response?.data?.message || "Couldn't remove item");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen max-w-screen-2xl container mx-auto md:px-20 px-4 pt-28 pb-16">
        <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

        {loading ? (
          <p className="text-gray-500 dark:text-gray-400">Loading cart...</p>
        ) : error ? (
          <p className="text-red-500">Couldn&apos;t load your cart right now.</p>
        ) : cart.items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 dark:text-gray-400 mb-4">Your cart is empty.</p>
            <Link to="/books" className="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-900 duration-300">
              Browse Books
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {cart.items.map((item) => (
                <div
                  key={item.book._id}
                  className="flex items-center gap-4 border-b border-gray-200 dark:border-gray-700 pb-4"
                >
                  <img
                    src={item.book.image}
                    alt={item.book.name}
                    className="w-16 h-20 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <p className="font-semibold">{item.book.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      &#8377;{item.book.price} each
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(item.book._id, item.quantity - 1)}
                      className="px-2 py-1 border rounded-md"
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(item.book._id, item.quantity + 1)}
                      className="px-2 py-1 border rounded-md"
                    >
                      +
                    </button>
                  </div>
                  <p className="w-20 text-right font-semibold">
                    &#8377;{item.book.price * item.quantity}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleRemove(item.book._id)}
                    className="text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xl font-bold">Total: &#8377;{total}</p>
              <button
                type="button"
                onClick={() => navigate("/checkout")}
                className="bg-blue-700 text-white px-6 py-2 rounded-md hover:bg-blue-900 duration-300"
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Cart;
