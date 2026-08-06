import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import Login from "./Login";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthProvider";

function Signup() {
  const location = useLocation();
  const { setAuthUser, setToken } = useAuth();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    const userInfo = {
      fullname: data.fullname,
      email: data.email,
      password: data.password,
    };
    await axios
      .post(`${import.meta.env.VITE_API_URL}/user/signup`, userInfo)
      .then((res) => {
        console.log(res.data);
        if (res.data) {
          toast.success("Signup Successfully");
          setAuthUser(res.data.user);
          setToken(res.data.token);
          localStorage.setItem("Users", JSON.stringify(res.data.user));
          navigate(from, { replace: true });
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Error: " + err.response.data.message);
      });
  };

  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-slate-900 px-4">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 dark:text-white rounded-2xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 relative">
          <form
            onSubmit={handleSubmit(onSubmit)}
            method="dialog"
            className="space-y-5"
          >
            <Link
              to="/"
              className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3"
            >
              ✕
            </Link>

            <div className="text-center">
              <h3 className="font-bold text-2xl">Create an account</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Join BookStore to get started
              </p>
            </div>
            {/* fullname */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Fullname</label>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 bg-white dark:bg-slate-800 dark:text-white"
                {...register("fullname", { required: true })}
              />
              {errors.fullname && (
                <span className="text-sm text-red-500">
                  This field is required
                </span>
              )}
            </div>
            {/* email */}
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
            {/* button */}
            <button className="w-full bg-blue-700 text-white rounded-lg py-2 font-medium hover:bg-blue-900 duration-200">
              Signup
            </button>
            <p className="text-center text-sm">
              Have an account?{" "}
              <button
                type="button"
                className="underline text-blue-600 dark:text-blue-400"
                onClick={() =>
                  document.getElementById("my_modal_3").showModal()
                }
              >
                Login
              </button>
            </p>
          </form>
        </div>
      </div>
      <Login />
    </>
  );
}

export default Signup;
