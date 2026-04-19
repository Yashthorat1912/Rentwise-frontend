import { useState } from "react";
import API from "../api/api";
import { useNavigate, useLocation } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { requestPermission, listenMessages } from "../notification";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const role = new URLSearchParams(location.search).get("role");

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/auth/login", { email, password });

      if (!res.data?.token) {
        alert("Login failed");
        return;
      }

      const user = res.data.user;

      // 🔥 NEW: ROLE VALIDATION
      if (role && user.role !== role) {
        alert(`Please login as ${role}`);
        setLoading(false);
        return;
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(user));
      await requestPermission();
      listenMessages();
      // ✅ Role-based navigation
      if (user.role === "landlord") {
        navigate("/landlord");
      } else {
        navigate("/tenant");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex min-h-screen">
      {/* 🔵 LEFT SIDE (BRANDING) */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 items-center justify-center text-white p-10">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">RentWise</h1>
          <p className="text-lg opacity-90">
            Smart Rental & Tenant Management System
          </p>

          <img
            src="https://cdn-icons-png.flaticon.com/512/295/295128.png"
            alt="illustration"
            className="w-72 mx-auto mt-8"
          />
        </div>
      </div>

      {/* ⚪ RIGHT SIDE (FORM) */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-gray-50 px-4">
        <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl">
          {/* TITLE */}
          <h2 className="text-3xl font-bold text-center text-gray-800">
            {role
              ? role === "landlord"
                ? "Landlord Login"
                : "Tenant Login"
              : "Login"}
          </h2>

          <p className="text-center text-gray-500 mb-6">Welcome back 👋</p>

          {/* EMAIL */}
          <div className="mb-4">
            <label className="text-sm text-gray-600">Email</label>
            <input
              type="email"
              placeholder="example@gmail.com"
              className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* PASSWORD */}
          <div className="mb-2 relative">
            <label className="text-sm text-gray-600">Password</label>

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* 👁 ICON BUTTON */}
            <span
              className="absolute right-3 top-[38px] cursor-pointer text-gray-500 hover:text-blue-600 transition"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* FORGOT PASSWORD */}
          <div
            className="text-right text-sm text-blue-600 mb-4 cursor-pointer hover:underline"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </div>

          {/* BUTTON */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-semibold transition ${
              loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* DIVIDER */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="px-3 text-gray-400 text-sm">OR</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* REGISTER */}
          <p className="text-center text-sm mt-6 text-gray-500">
            Don’t have an account?{" "}
            <span
              className="text-blue-600 cursor-pointer hover:underline"
              onClick={() => navigate("/register")}
            >
              Register
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
