"use client";
import { useState, useEffect } from "react";
import { GoogleAuthProvider } from "firebase/auth";
import { auth } from "../lib/firebaseConfig";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "../../redux/slices/authSlice"; // Redux actions

export default function Signup() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    errors: {},
  });

  const dispatch = useDispatch();
  const router = useRouter();
  const googleProvider = new GoogleAuthProvider();

  const { loading, error, successMessage } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const errors = {};
    if (!formData.firstName) errors.firstName = "First Name is required.";
    if (!formData.lastName) errors.lastName = "Last Name is required.";
    if (!formData.email) errors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      errors.email = "Email address is invalid.";
    if (!formData.password) errors.password = "Password is required.";
    else if (formData.password.length < 6)
      errors.password = "Password must be at least 6 characters long.";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setFormData({ ...formData, errors: validationErrors });

    if (Object.keys(validationErrors).length === 0) {
      // Dispatch the signup action
      dispatch(
        signupUser({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
        })
      );
    }
  };

  // Handle redirect after successful signup
  useEffect(() => {
    if (successMessage) {
      router.push({
        pathname: "/login",
        query: { successMessage },
      });
    }
  }, [successMessage, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat bg-fixed bg-[url('/assets/background_image.png')]">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formData.errors?.firstName && (
              <p className="text-red-500 text-xs mt-2">
                {formData.errors.firstName}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formData.errors?.lastName && (
              <p className="text-red-500 text-xs mt-2">
                {formData.errors.lastName}
              </p>
            )}
          </div>

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
            {formData.errors?.email && (
              <p className="text-red-500 text-xs mt-2">
                {formData.errors.email}
              </p>
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
            {formData.errors?.password && (
              <p className="text-red-500 text-xs mt-2">
                {formData.errors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-gray-800 text-white font-semibold rounded-full hover:bg-black transition duration-300"
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        {error && (
          <p className="text-center mt-4 text-red-500">{error.message}</p>
        )}

        <div className="text-center mt-6">
          <p>
            Already registered?{" "}
            <Link href="/login" className="text-blue-500">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
