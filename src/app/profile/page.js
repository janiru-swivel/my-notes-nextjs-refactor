"use client";

import { useState } from "react";
import { ref, set } from "firebase/database";
import { updatePassword } from "firebase/auth";
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
  const [fileUploaded, setFileUploaded] = useState(false); // Track if the profile picture has been uploaded

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFileUploaded(!!files.length); // Set fileUploaded to true if a file is uploaded
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0 && user) {
      const userRef = ref(database, `users/${user.uid}`);

      const { name, email, password, age, phoneNumber } = formData;

      // Update fields in the Firebase Realtime Database
      set(ref(database, `users/${user.uid}/name`), name);
      set(ref(database, `users/${user.uid}/email`), email);
      set(ref(database, `users/${user.uid}/age`), age);
      set(ref(database, `users/${user.uid}/phoneNumber`), phoneNumber);

      // Optionally handle profile picture upload here

      // Update password in Firebase Authentication
      if (formData.password) {
        try {
          await updatePassword(user, formData.password);
          setMessage("Profile updated successfully, including password!");
        } catch (error) {
          setErrors({ password: "Error updating password: " + error.message });
          return;
        }
      } else {
        setMessage("Profile updated successfully!");
      }
    }
  };

  return (
    <>
      <NavBar />
      <br />
      <div className="max-w-md mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-center mb-4">Edit Profile</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Profile Picture Upload */}
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Picture
            </label>
            <div className="relative">
              <input
                type="file"
                name="profilePicture"
                id="profilePicture"
                accept="image/*"
                onChange={handleChange}
                className="hidden" // Hides the default input element
              />
              <label
                htmlFor="profilePicture"
                className={`block text-center cursor-pointer w-full py-2 px-4 rounded-lg shadow-md font-semibold transition duration-300 ease-in-out ${
                  fileUploaded
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                }`}
              >
                {fileUploaded ? "File Uploaded" : "Choose File"}
              </label>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Only images are allowed (JPG, PNG).
            </p>
          </div>

          <div className="form-group">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className="border rounded-md p-2"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>

          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="border rounded-md p-2"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="border rounded-md p-2"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>

          <div className="form-group">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="border rounded-md p-2"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
            )}
          </div>

          <div className="form-group">
            <input
              type="number"
              name="age"
              placeholder="Age"
              value={formData.age}
              onChange={handleChange}
              className="border rounded-md p-2"
            />
            {errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}
          </div>

          <div className="form-group">
            <input
              type="tel"
              name="phoneNumber"
              placeholder="Phone Number"
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
      <br />
    </>
  );
}

export default ProfilePage;
