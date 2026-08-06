import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";

const API = import.meta.env.VITE_API_URL;

function OrderConfirmation() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`${API}/order/getDetails/${orderId}`);
        setOrder(res.data.order);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [orderId]);

  return (
    <div>
      <Navbar />
      <div className="min-h-screen max-w-screen-2xl container mx-auto md:px-20 px-4 pt-28 pb-16">
        {loading ? (
          <p className="text-gray-500 dark:text-gray-400">Loading order...</p>
        ) : error || !order ? (
          <p className="text-red-500">Couldn&apos;t find that order.</p>
        ) : (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold">
                {order.paymentStatus === "paid" ? "Order Confirmed!" : "Order Placed"}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Order #{order._id}
              </p>
            </div>

            <div className="border rounded-lg p-4 border-gray-300 dark:border-gray-600 mb-4">
              <h2 className="font-semibold mb-2">Items</h2>
              {order.items.map((item) => (
                <div key={item.book} className="flex justify-between text-sm mb-1">
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>&#8377;{item.price * item.quantity}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <span>Total</span>
                <span>&#8377;{order.totalAmount}</span>
              </div>
            </div>

            <div className="border rounded-lg p-4 border-gray-300 dark:border-gray-600 mb-4">
              <h2 className="font-semibold mb-2">Delivery Address</h2>
              <p className="text-sm">
                {order.address.fullname} — {order.address.phone}
                <br />
                {order.address.line1}
                {order.address.line2 ? `, ${order.address.line2}` : ""}, {order.address.city},{" "}
                {order.address.state} {order.address.postalCode}, {order.address.country}
              </p>
            </div>

            <div className="border rounded-lg p-4 border-gray-300 dark:border-gray-600 mb-6">
              <h2 className="font-semibold mb-2">Status</h2>
              <p className="text-sm capitalize">Order: {order.status}</p>
              <p className="text-sm capitalize">Payment: {order.paymentStatus}</p>
            </div>

            <div className="flex gap-4 justify-center">
              <Link to="/orders" className="underline text-blue-600 dark:text-blue-400">
                View all orders
              </Link>
              <Link to="/books" className="underline text-blue-600 dark:text-blue-400">
                Continue shopping
              </Link>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default OrderConfirmation;
