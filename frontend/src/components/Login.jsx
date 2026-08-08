import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthProvider";

function Login() {
  const location = useLocation();
  const { setAuthUser, setToken } = useAuth();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    const userInfo = {
      fullname: data.fullname,
      email: data.email,
      password: data.password,
    };
    await axios
      .post(`${import.meta.env.VITE_API_URL}/user/login`, userInfo)
      .then((res) => {
        console.log(res.data);
        if (res.data) {
          toast.success("Login Successfully");
          setAuthUser(res.data.user);
          setToken(res.data.token);
          localStorage.setItem("Users", JSON.stringify(res.data.user));
          reset();
          navigate(from, { replace: true });
          setTimeout(() => {
            document.getElementById("my_modal_3").close();
          }, 1500);
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Error: " + err.response.data.message);
      });
  };
  return (
    <div>
      <dialog id="my_modal_3" className="modal">
        <div className="modal-box w-full max-w-sm bg-white dark:bg-slate-900 dark:text-white rounded-2xl p-8 shadow-xl">
          <form
            onSubmit={handleSubmit(onSubmit)}
            method="dialog"
            className="space-y-5"
          >
            <Link
              to="/"
              className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3"
              onClick={() => {
                reset();
                document.getElementById("my_modal_3").close();
              }}
            >
              ✕
            </Link>
            <div className="text-center">
              <h3 className="font-bold text-2xl">Welcome back</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Login to continue
              </p>
            </div>
            {/* Email */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 bg-white dark:bg-slate-800 dark:text-white"
                {...register("email", { required: true })}
              />
              {errors.email && (
                <span className="text-sm text-red-500">
                  This field is required
                </span>
              )}
            </div>
            {/* password */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 bg-white dark:bg-slate-800 dark:text-white"
                {...register("password", { required: true })}
              />
              {errors.password && (
                <span className="text-sm text-red-500">
                  This field is required
                </span>
              )}
            </div>
            <button className="w-full bg-blue-700 text-white rounded-lg py-2 font-medium hover:bg-blue-900 duration-200">
              Login
            </button>
            <p className="text-center text-sm">
              Not registered?{" "}
              <Link
                to="/signup"
                className="underline text-blue-600 dark:text-blue-400 cursor-pointer"
              >
                Signup
              </Link>
            </p>
          </form>
        </div>
      </dialog>
    </div>
  );
}

export default Login;
