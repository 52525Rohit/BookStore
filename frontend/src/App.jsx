import Home from "./Home/Home";

import { Navigate, Route, Routes } from "react-router-dom";
import Courses from "./Courses/Courses";
import Signup from "./components/Signup";
import Contact from "./components/Contact";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./context/AuthProvider";
import Login from "./components/Login";
import About from "./components/About";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import OrderConfirmation from "./components/OrderConfirmation";
import OrderHistory from "./components/OrderHistory";

function App() {
  const { authUser } = useAuth();
  return (
    <>
      <div className="dark:bg-slate-900 dark:text-white">
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path='/course' element={<Courses />} /> */}
          <Route
            path="/books"
            element={authUser ? <Courses /> : <Navigate to="/signup" />}
          />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/cart"
            element={authUser ? <Cart /> : <Navigate to="/signup" />}
          />
          <Route
            path="/checkout"
            element={authUser ? <Checkout /> : <Navigate to="/signup" />}
          />
          <Route
            path="/orders"
            element={authUser ? <OrderHistory /> : <Navigate to="/signup" />}
          />
          <Route
            path="/orders/:orderId"
            element={authUser ? <OrderConfirmation /> : <Navigate to="/signup" />}
          />
        </Routes>
        <Toaster className="dark:bg-slate-900 dark:text-white" />
      </div>
    </>
  );
}

export default App;
