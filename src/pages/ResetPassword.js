import { useState, useEffect } from "react";
import API from "../api/api";
import { useLocation, useNavigate } from "react-router-dom";

function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();

  const emailFromState = location.state?.email || "";

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    if (emailFromState) {
      setEmail(emailFromState);
    } else {
      navigate("/forgot-password");
    }
  }, [emailFromState, navigate]);

  const resetPassword = async () => {
    if (!otp || !newPassword) {
      alert("Please fill all fields");
      return;
    }

    try {
      await API.post("/auth/reset-password", {
        email,
        otp,
        newPassword,
      });

      alert("Password reset successful");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Error resetting password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-100 px-4">
      {/* CARD */}
      <div className="w-full max-w-md bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-8 border border-gray-200">
        {/* HEADER */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800">
            Reset Password 🔐
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Enter OTP and set a new password
          </p>
        </div>

        {/* FORM */}
        <div className="space-y-4">
          {/* Email */}
          <div>
            <label className="text-sm text-gray-500">Email</label>
            <input
              className="w-full mt-1 p-3 border rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
              value={email}
              readOnly
            />
          </div>

          {/* OTP */}
          <div>
            <label className="text-sm text-gray-500">OTP</label>
            <input
              className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-gray-500">New Password</label>
            <input
              type="password"
              className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          {/* BUTTON */}
          <button
            onClick={resetPassword}
            className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-3 rounded-lg font-medium shadow-md"
          >
            Reset Password
          </button>
        </div>

        {/* FOOTER */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Secure password reset powered by RentWise
        </p>
      </div>
    </div>
  );
}

export default ResetPassword;
