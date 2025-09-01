import { useState } from "react";
import { login } from "../services/authService";
import { Link, useNavigate } from "react-router-dom";
export default function Login() {
     const [formData, setFormData] = useState({
        email: "",
        password: "",
      });

      const [errors, setErrors] = useState({});
      const [errorMsg, setErrorMsg] = useState("");
      const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log("Form Submitted", formData);
    login(formData).then((response) => {
      setFormData({
        email: "",
        password: ""
      });
      setErrors({});
      // Handle successful registration, e.g., redirect to login or show success message
      // For now, just log the response
      // You might want to redirect the user or show a success message here

      console.log("Registration successful", response);
      localStorage.setItem("user", JSON.stringify(response));
      localStorage.setItem("isAuthenticated", true);
      navigate("/dashboard");
    }).catch((error) => {
      if (error.errors) {
        setErrors(error.errors);
        console.error("Registration error: ", error.errors);
      }
      else {
        setErrorMsg(error.message || "Login failed");
        console.error("Login failed", error);
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-amber-900 mb-4">
          Login to Smart HR
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Access your account to manage your HR tasks.
        </p>
        <p>
            {errorMsg && <span className="text-red-500">{errorMsg}</span>}
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
         
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
            {/* forgot password */}
            <Link to="/forgot-password" className="text-sm text-green-600 hover:underline float-right">
              Forgot Password?
            </Link>
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
          

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-500 transition"
          >
            Sign In
          </button>
            <p className="text-center text-sm text-gray-600 mt-4">
                Don't have an account?{" "}
               <Link to="/register" className="text-green-600 hover:underline">
                Register here
                </Link>
            </p>
        </form>
      </div>
    </div>
  );
}