import axios from "axios";
import { useAuth } from "../context/AuthProvider";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

function Logout() {
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/";

  const { setAuthUser, setToken } = useAuth();
  const handleLogout = () => {
    try {
      setAuthUser(undefined);
      setToken(undefined);
      localStorage.removeItem("Users");
      toast.success("Logout successfully");
      navigate(from, { replace: true });
      setTimeout(() => {
        // window.location.reload(); // This is no longer necessary
      }, 3000);
    } catch (error) {
      toast.error("Error: " + error);
      setTimeout(() => {}, 2000);
    }
  };
  return (
    <div>
      <button
        className="px-3 py-2 bg-red-500 text-white rounded-md cursor-pointer"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
}

export default Logout;
