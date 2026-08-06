import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import Navbar from "./Navbar";
import Footer from "./Footer";
import useCart from "../hooks/useCart";

const API = import.meta.env.VITE_API_URL;

function Checkout() {
  const { cart, loading: cartLoading, total } = useCart();
  const [addresses, setAddresses] = useState([]);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const loadAddresses = async () => {
    setAddressesLoading(true);
    try {
      const res = await axios.get(`${API}/address/getAddresses`);
      setAddresses(res.data.addresses);
      const defaultAddress = res.data.addresses.find((a) => a.isDefault) || res.data.addresses[0];
      if (defaultAddress) setSelectedAddressId(defaultAddress._id);
    } catch (err) {
      toast.error(err.response?.data?.message || "Couldn't load addresses");
    } finally {
      setAddressesLoading(false);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const onAddAddress = async (data) => {
    try {
      const res = await axios.post(`${API}/address/add`, data);
      toast.success("Address added");
      setAddresses((prev) => [res.data.address, ...prev]);
      setSelectedAddressId(res.data.address._id);
      setShowAddForm(false);
      reset();
    } catch (err) {
      toast.error(err.response?.data?.message || "Couldn't add address");
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast.error("Please select a delivery address");
      return;
    }
    if (!window.Razorpay) {
      toast.error("Payment gateway failed to load. Check your connection and try again.");
      return;
    }
    setPlacingOrder(true);
    try {
      const orderRes = await axios.post(`${API}/order/create`, {
        addressId: selectedAddressId,
      });
      const order = orderRes.data.order;

      const paymentRes = await axios.post(`${API}/payment/initiate`, {
        orderId: order._id,
      });
      const { razorpayOrderId, amount, currency, keyId } = paymentRes.data;

      const rzp = new window.Razorpay({
        key: keyId,
        amount,
        currency,
        order_id: razorpayOrderId,
        name: "BookStore",
        description: `Order #${order._id}`,
        handler: async (response) => {
          try {
            await axios.post(`${API}/payment/callback`, {
              orderId: order._id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            toast.success("Order placed successfully!");
            navigate(`/orders/${order._id}`);
          } catch (err) {
            toast.error(err.response?.data?.message || "Payment verification failed");
            navigate(`/orders/${order._id}`);
          } finally {
            setPlacingOrder(false);
          }
        },
        modal: {
          ondismiss: () => {
            setPlacingOrder(false);
            toast.error("Payment cancelled");
          },
        },
        prefill: {
          name: addresses.find((a) => a._id === selectedAddressId)?.fullname,
          contact: addresses.find((a) => a._id === selectedAddressId)?.phone,
        },
        theme: { color: "#1d4ed8" },
      });
      rzp.on("payment.failed", () => {
        setPlacingOrder(false);
        toast.error("Payment failed. Please try again.");
      });
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || "Couldn't place order");
      setPlacingOrder(false);
    }
  };

  if (!cartLoading && cart.items.length === 0) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center pt-20 gap-4">
          <p className="text-gray-500 dark:text-gray-400">Your cart is empty.</p>
          <Link to="/books" className="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-900 duration-300">
            Browse Books
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen max-w-screen-2xl container mx-auto md:px-20 px-4 pt-28 pb-16">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h2 className="text-lg font-semibold mb-3">Delivery Address</h2>

            {addressesLoading ? (
              <p className="text-gray-500 dark:text-gray-400">Loading addresses...</p>
            ) : (
              <div className="space-y-3">
                {addresses.map((address) => (
                  <label
                    key={address._id}
                    className={`block border rounded-lg p-4 cursor-pointer ${
                      selectedAddressId === address._id
                        ? "border-blue-600 ring-2 ring-blue-600"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      className="mr-2"
                      checked={selectedAddressId === address._id}
                      onChange={() => setSelectedAddressId(address._id)}
                    />
                    <span className="font-medium">{address.fullname}</span> — {address.phone}
                    <br />
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {address.line1}
                      {address.line2 ? `, ${address.line2}` : ""}, {address.city}, {address.state}{" "}
                      {address.postalCode}, {address.country}
                    </span>
                  </label>
                ))}
              </div>
            )}

            {!showAddForm ? (
              <button
                type="button"
                onClick={() => setShowAddForm(true)}
                className="mt-4 underline text-blue-600 dark:text-blue-400"
              >
                + Add a new address
              </button>
            ) : (
              <form
                onSubmit={handleSubmit(onAddAddress)}
                className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 border rounded-lg p-4 border-gray-300 dark:border-gray-600"
              >
                <input
                  placeholder="Full name"
                  className="border rounded-md px-3 py-2 bg-white dark:bg-slate-800 dark:border-gray-600"
                  {...register("fullname", { required: true })}
                />
                <input
                  placeholder="Phone"
                  className="border rounded-md px-3 py-2 bg-white dark:bg-slate-800 dark:border-gray-600"
                  {...register("phone", { required: true })}
                />
                <input
                  placeholder="Address line 1"
                  className="border rounded-md px-3 py-2 bg-white dark:bg-slate-800 dark:border-gray-600 sm:col-span-2"
                  {...register("line1", { required: true })}
                />
                <input
                  placeholder="Address line 2 (optional)"
                  className="border rounded-md px-3 py-2 bg-white dark:bg-slate-800 dark:border-gray-600 sm:col-span-2"
                  {...register("line2")}
                />
                <input
                  placeholder="City"
                  className="border rounded-md px-3 py-2 bg-white dark:bg-slate-800 dark:border-gray-600"
                  {...register("city", { required: true })}
                />
                <input
                  placeholder="State"
                  className="border rounded-md px-3 py-2 bg-white dark:bg-slate-800 dark:border-gray-600"
                  {...register("state", { required: true })}
                />
                <input
                  placeholder="Postal code"
                  className="border rounded-md px-3 py-2 bg-white dark:bg-slate-800 dark:border-gray-600"
                  {...register("postalCode", { required: true })}
                />
                <input
                  placeholder="Country"
                  className="border rounded-md px-3 py-2 bg-white dark:bg-slate-800 dark:border-gray-600"
                  {...register("country", { required: true })}
                />
                {Object.keys(errors).length > 0 && (
                  <p className="text-sm text-red-500 sm:col-span-2">Please fill all required fields.</p>
                )}
                <div className="sm:col-span-2 flex gap-3">
                  <button type="submit" className="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-900 duration-300">
                    Save Address
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="border rounded-lg p-4 border-gray-300 dark:border-gray-600 h-fit">
            <h2 className="text-lg font-semibold mb-3">Order Summary</h2>
            {cart.items.map((item) => (
              <div key={item.book._id} className="flex justify-between text-sm mb-2">
                <span>
                  {item.book.name} × {item.quantity}
                </span>
                <span>&#8377;{item.book.price * item.quantity}</span>
              </div>
            ))}
            <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <span>Total</span>
              <span>&#8377;{total}</span>
            </div>
            <button
              type="button"
              disabled={placingOrder}
              onClick={handlePlaceOrder}
              className="w-full mt-4 bg-blue-700 text-white py-2 rounded-md hover:bg-blue-900 duration-300 disabled:opacity-50"
            >
              {placingOrder ? "Placing order..." : "Place Order & Pay"}
            </button>
            <p className="text-xs text-gray-400 mt-2 text-center">
              Secure payment powered by Razorpay.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Checkout;
