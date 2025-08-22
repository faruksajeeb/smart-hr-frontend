import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "../services/authServices";

import AdminLayout from "../layouts/AdminLayout";

export default function Profile() {

  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    password: "",
    confirmed_password: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // if password not empty then check if confirmed_password matches
    if (
      formData.password &&
      formData.password !== formData.confirmed_password
    ) {
      alert("Passwords do not match!");
      return;
    }
    // console.log("Form Submitted", formData);
    // for update send also bearer token
    updateProfile(formData)
      .then((response) => {
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmed_password: "",
        });
        setErrors({});
        console.log("Profile update successful", response);
        localStorage.setItem("user", JSON.stringify(response));
        localStorage.setItem("isAuthenticated", true);
        navigate("/profile");
      })
      .catch((error) => {
        if (error.errors) {
          setErrors(error.errors);
          console.error("Profile update error: ", error.errors);
        } else {
          console.error("Profile update failed", error);
        }
      });
  };

  return (
    <AdminLayout>
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-amber-900 mb-4">
          Profile
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-900 focus:outline-none"
            />
            <span className="text-red-500">{errors.name}</span>
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-900 focus:outline-none"
            />
            <span className="text-red-500">{errors.email}</span>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-900 focus:outline-none"
            />
            <span className="text-red-500">{errors.password}</span>
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmed_password"
              id="confirmed_password"
              value={formData.confirmed_password}
              onChange={handleChange}
              placeholder="Confirm your password"
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-900 focus:outline-none"
            />
            <span className="text-red-500">{errors.confirmed_password}</span>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-500 transition"
          >
            Update Profile
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
