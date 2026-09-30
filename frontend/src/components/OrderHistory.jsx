import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";

import { API } from "../api";

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`${API}/order/getHistory`);
        setOrders(res.data.orders);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="min-h-screen max-w-screen-2xl container mx-auto md:px-20 px-4 pt-28 pb-16">
        <h1 className="text-2xl font-bold mb-6">My Orders</h1>

        {loading ? (
          <p className="text-gray-500 dark:text-gray-400">Loading orders...</p>
        ) : error ? (
          <p className="text-red-500">Couldn&apos;t load your orders.</p>
        ) : orders.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 dark:text-gray-400 mb-4">You haven&apos;t placed any orders yet.</p>
            <Link to="/books" className="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-900 duration-300">
              Browse Books
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <Link
                key={order._id}
                to={`/orders/${order._id}`}
                className="block border rounded-lg p-4 border-gray-300 dark:border-gray-600 hover:border-blue-600 duration-200"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Order #{order._id}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString()} · {order.items.length} item(s)
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">&#8377;{order.totalAmount}</p>
                    <p className="text-sm capitalize text-gray-500 dark:text-gray-400">
                      {order.paymentStatus}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default OrderHistory;
