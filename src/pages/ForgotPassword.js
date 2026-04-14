import { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const sendOtp = async () => {
    if (!email) {
      alert("Please enter email");
      return;
    }

    try {
      setLoading(true);

      await API.post("/auth/send-otp", { email });

      alert("OTP sent to your email");

      navigate("/reset-password", { state: { email } });
    } catch {
      alert("Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-100 px-4">
      {/* CARD */}
      <div className="w-full max-w-md bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-8 border border-gray-200">
        {/* HEADER */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Forgot Password 🔑
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Enter your email to receive OTP
          </p>
        </div>

        {/* FORM */}
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-500">Email</label>
            <input
              className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            onClick={sendOtp}
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-medium shadow-md transition ${
              loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </div>

        {/* FOOTER */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Secure password recovery powered by RentWise
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
