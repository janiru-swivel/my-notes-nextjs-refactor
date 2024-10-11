"use client";
import { useState } from "react";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../lib/firebaseConfig";
import { useRouter } from "next/navigation";
import Link from "next/link";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const router = useRouter();
  const googleProvider = new GoogleAuthProvider();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        await signInWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        setMessage("User logged in successfully");
        router.push("/home");
      } catch (error) {
        if (error.code === "auth/user-not-found") {
          setErrors({
            email: "You don't have an account registered to this email",
          });
        } else {
          console.error("Error logging in user:", error);
          setMessage("You don't have an account registered to this email");
        }
      }
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setErrors({
        email: "Please enter your email address to reset password.",
      });
      return;
    }

    try {
      await sendPasswordResetEmail(auth, formData.email);
      setMessage("Password reset email sent. Please check your inbox.");
    } catch (error) {
      console.error("Error sending password reset email:", error);
      setMessage("Error sending password reset email: " + error.message);
    }
  };

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
            {errors.email && (
              <p className="text-red-500 text-xs mt-2">{errors.email}</p>
            )}
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
            {errors.password && (
              <p className="text-red-500 text-xs mt-2">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-gray-800 text-white font-semibold rounded-full hover:bg-black transition duration-300"
          >
            Login
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
