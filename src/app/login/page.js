"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  loginUser,
  sendResetPassword,
  clearMessage,
} from "../../redux/slices/authSlice";
import { useRouter } from "next/navigation";
import Link from "next/link";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const router = useRouter();
  const { error, message, loading, user } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const errors = {};
    if (!formData.email) errors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      errors.email = "Email address is invalid.";
    if (!formData.password) errors.password = "Password is required.";
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length === 0) {
      dispatch(loginUser(formData))
        .unwrap()
        .then(() => {
          router.push("/home"); // Redirect to home page after successful login
        })
        .catch(() => {
          // Handle the error if needed, e.g., display a message
        });
    }
  };

  const handleForgotPassword = () => {
    if (!formData.email) {
      // Dispatch error message for missing email
      dispatch(clearMessage());
      return;
    }
    dispatch(sendResetPassword(formData.email));
  };

  useEffect(() => {
    if (user) {
      router.push("/home"); // Redirect if the user is already logged in
    }
  }, [user, router]);

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed flex items-center justify-center bg-[url('/assets/background_image.png')]">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-gray-800 text-white font-semibold rounded-full hover:bg-black transition duration-300"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {message && (
          <p className="text-center mt-4 text-green-500">{message}</p>
        )}

        <div className="text-center mt-6">
          <p>
            Don’t have an account?{" "}
            <Link href="/signup" className="text-blue-500">
              Sign Up
            </Link>
          </p>
          <p className="mt-2">
            <span
              className="cursor-pointer text-blue-500"
              onClick={handleForgotPassword}
            >
              Forgot Password?
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
