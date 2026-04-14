import { useNavigate } from "react-router-dom";
import { Building2, CreditCard, MessageCircle } from "lucide-react";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* 🔹 NAVBAR */}
      <div className="flex justify-between items-center px-10 py-4 bg-white shadow-sm">
        <h1 className="text-2xl font-bold text-blue-600">RentWise</h1>

        <div className="space-x-4">
          <button
            className="text-gray-600 hover:text-blue-600 transition"
            onClick={() => navigate("/login")}
          >
            Login
          </button>

          <button
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
            onClick={() => navigate("/register")}
          >
            Get Started
          </button>
        </div>
      </div>

      {/* 🔹 HERO SECTION */}
      <div className="flex flex-1 flex-col md:flex-row items-center justify-between px-10 md:px-20 py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* LEFT */}
        <div className="max-w-xl">
          <h2 className="text-5xl font-bold leading-tight mb-6 text-gray-800">
            Smart Rental <br /> Management Made Easy
          </h2>

          <p className="text-gray-600 mb-8 text-lg">
            Manage properties, tenants, rent payments, and maintenance — all in
            one powerful platform.
          </p>

          {/* BUTTONS */}
          <div className="flex gap-4">
            <button
              className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition"
              onClick={() => navigate("/login?role=tenant")}
            >
              Tenant Login
            </button>

            <button
              className="bg-gray-900 text-white px-6 py-3 rounded-lg shadow hover:bg-black transition"
              onClick={() => navigate("/login?role=landlord")}
            >
              Landlord Login
            </button>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <img
          src="https://cdn-icons-png.flaticon.com/512/1040/1040230.png"
          className="w-[400px] mt-10 md:mt-0"
          alt="buildings"
        />
      </div>

      {/* 🔹 FEATURES */}
      <div className="px-10 md:px-20 py-16 bg-white">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
          Why Choose RentWise?
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {/* CARD 1 */}
          <div className="p-6 bg-gray-50 rounded-xl shadow hover:shadow-lg transition text-center">
            <Building2 className="mx-auto mb-4 text-blue-600" size={40} />
            <h3 className="font-semibold text-lg mb-2">Property Management</h3>
            <p className="text-gray-500">
              Easily manage multiple properties and tenants in one place.
            </p>
          </div>

          {/* CARD 2 */}
          <div className="p-6 bg-gray-50 rounded-xl shadow hover:shadow-lg transition text-center">
            <CreditCard className="mx-auto mb-4 text-green-600" size={40} />
            <h3 className="font-semibold text-lg mb-2">Online Payments</h3>
            <p className="text-gray-500">
              Secure and fast rent payments with real-time tracking.
            </p>
          </div>

          {/* CARD 3 */}
          <div className="p-6 bg-gray-50 rounded-xl shadow hover:shadow-lg transition text-center">
            <MessageCircle className="mx-auto mb-4 text-purple-600" size={40} />
            <h3 className="font-semibold text-lg mb-2">Real-Time Chat</h3>
            <p className="text-gray-500">
              Communicate instantly with tenants and landlords.
            </p>
          </div>
        </div>
      </div>

      {/* 🔹 CTA SECTION */}
      <div className="bg-blue-600 text-white text-center py-12 px-6">
        <h2 className="text-3xl font-bold mb-4">
          Start Managing Smarter Today 🚀
        </h2>

        <p className="mb-6 opacity-90">
          Join RentWise and simplify your rental experience.
        </p>

        <button
          className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          onClick={() => navigate("/register")}
        >
          Create Account
        </button>
      </div>
    </div>
  );
}

export default Home;
