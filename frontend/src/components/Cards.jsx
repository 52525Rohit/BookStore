import { API } from "../api";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

function Card({ item }) {
  const { authUser } = useAuth();
  const navigate = useNavigate();

  const handleBuyNow = async () => {
    if (!authUser) {
      toast.error("Please login to add items to your cart");
      navigate("/signup");
      return;
    }
    try {
      await axios.post(`${API}/cart/add`, {
        bookId: item._id,
        quantity: 1,
      });
      toast.success(`Added "${item.name}" to your cart`);
      navigate("/cart");
    } catch (err) {
      toast.error(err.response?.data?.message || "Couldn't add to cart");
    }
  };
  return (
    <>
      <div className="mt-4 my-3 p-3">
        <div className="card w-92 bg-base-100 shadow-xl hover:scale-105 duration-200 dark:bg-slate-900 dark:text-white dark:border cursor-pointer">
          <figure>
            <img src={item.image} alt="Books" />
          </figure>
          <div className="card-body">
            <h2 className="card-title">
              {item.name}
              <div className="badge badge-secondary">{item.category}</div>
            </h2>
            <p>{item.title}</p>
            <div className="card-actions justify-between">
              <div className="badge badge-outline">&#8377;{item.price}</div>
              <button
                type="button"
                onClick={handleBuyNow}
                className="cursor-pointer px-3 py-2 rounded-full border-[2px] hover:bg-pink-900 hover:text-white duration-200"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Card;
