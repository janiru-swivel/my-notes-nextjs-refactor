"use client";

import { useState } from "react";
import { ref, set } from "firebase/database";
import { database, auth } from "../lib/firebaseConfig";
import NavBar from "../components/NavBar/Navbar";
import { useAuthState } from "react-firebase-hooks/auth";

function ProfilePage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    phoneNumber: "",
    profilePicture: null,
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [user] = useAuthState(auth); // Get the currently logged-in user

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const validate = () => {
    const errors = {};
    if (!formData.name) errors.name = "Name is required.";
    if (!formData.email) errors.email = "Email is required.";
    if (!formData.password) errors.password = "Password is required.";
    if (formData.password !== formData.confirmPassword)
      errors.confirmPassword = "Passwords do not match.";
    if (!formData.age) errors.age = "Age is required.";
    if (!formData.phoneNumber) errors.phoneNumber = "Phone number is required.";
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0 && user) {
      const userRef = ref(database, `users/${user.uid}`);

      const { name, email, password, age, phoneNumber } = formData;

      // Save each field as a separate entity
      set(ref(database, `users/${user.uid}/name`), name);
      set(ref(database, `users/${user.uid}/email`), email);
      set(ref(database, `users/${user.uid}/password`), password);
      set(ref(database, `users/${user.uid}/age`), age);
      set(ref(database, `users/${user.uid}/phoneNumber`), phoneNumber);

      if (formData.profilePicture) {
        // Optionally handle profile picture upload here
      }

      setMessage("Profile updated successfully!");
    }
  };

  return (
    <>
      <NavBar />
      <br />
      <div className="max-w-md mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-center mb-4">Edit Profile</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="form-group">
            <label className="font-semibold mb-1">Profile Picture</label>
            <input
              type="file"
              name="profilePicture"
              accept="image/*"
              onChange={handleChange}
              className="border rounded-md p-2"
            />
          </div>

          <div className="form-group">
            <label className="font-semibold mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="border rounded-md p-2"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>

          <div className="form-group">
            <label className="font-semibold mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="border rounded-md p-2"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          <div className="form-group">
            <label className="font-semibold mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="border rounded-md p-2"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>

          <div className="form-group">
            <label className="font-semibold mb-1">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="border rounded-md p-2"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
            )}
          </div>

          <div className="form-group">
            <label className="font-semibold mb-1">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="border rounded-md p-2"
            />
            {errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}
          </div>

          <div className="form-group">
            <label className="font-semibold mb-1">Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="border rounded-md p-2"
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
            )}
          </div>

          <button
            type="submit"
            className="mt-4 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Save Changes
          </button>
        </form>
        {message && (
          <p className="mt-4 text-green-600 font-bold text-center">{message}</p>
        )}
      </div>
    </>
  );
}

export default ProfilePage;
