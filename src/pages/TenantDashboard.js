import { useEffect, useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";
import { Home, CreditCard, Wrench, FileText } from "lucide-react";

function TenantDashboard() {
  const [requests, setRequests] = useState([]);
  const [lease, setLease] = useState(null);
  const [payments, setPayments] = useState([]);
  const [paying, setPaying] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const leaseRes = await API.get("/leases/my");
      setLease(leaseRes.data);

      const reqRes = await API.get(
        `/maintenance/my?lease_id=${leaseRes.data._id}`,
      );
      setRequests(reqRes.data);

      const payRes = await API.get(`/payments/${leaseRes.data._id}`);
      setPayments(payRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePayment = async () => {
    try {
      setPaying(true);

      await API.post("/payments", {
        lease_id: lease._id,
        amount: lease.rent_amount,
      });

      fetchData();
    } catch (err) {
      alert("Payment failed");
    } finally {
      setPaying(false);
    }
  };

  if (!lease) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-2xl font-semibold text-gray-700">
          No Lease Assigned
        </h2>
        <p className="text-gray-500 mt-2">Please contact your landlord.</p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen space-y-8">
      {/* 🔥 HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Home size={28} /> Tenant Dashboard
          </h1>
          <p className="text-gray-500 text-sm">
            Manage rent, requests & lease details
          </p>
        </div>

        <button
          onClick={() => navigate("/chat")}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-lg shadow hover:scale-105 transition"
        >
          Chat
        </button>
      </div>

      {/* 📊 STATS */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
          <p className="text-gray-500 text-sm">Monthly Rent</p>
          <h2 className="text-2xl font-bold mt-2 text-indigo-600">
            ₹ {lease.rent_amount}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
          <p className="text-gray-500 text-sm">Requests</p>
          <h2 className="text-2xl font-bold mt-2 text-blue-600">
            {requests.length}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
          <p className="text-gray-500 text-sm">Payments</p>
          <h2 className="text-2xl font-bold mt-2 text-green-600">
            {payments.length}
          </h2>
        </div>
      </div>

      {/* 📄 LEASE INFO */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FileText size={18} /> Lease Details
        </h3>

        <div className="grid grid-cols-2 gap-6 text-sm">
          <div>
            <p className="text-gray-500">Property</p>
            <p className="font-medium text-gray-800">
              {lease.property_id?.address || "N/A"}
            </p>
          </div>

          <div>
            <p className="text-gray-500">Rent</p>
            <p className="font-medium text-gray-800">₹ {lease.rent_amount}</p>
          </div>

          <div className="col-span-2">
            <p className="text-gray-500">Lease Document</p>
            {lease.lease_document_url ? (
              <a
                href={`${process.env.REACT_APP_API_URL}/${lease.lease_document_url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline font-medium"
              >
                View PDF
              </a>
            ) : (
              <p className="text-gray-400">No document uploaded</p>
            )}
          </div>
        </div>
      </div>

      {/* ⚡ ACTIONS */}
      <div className="grid grid-cols-2 gap-6">
        {/* 💳 PAY RENT */}
        <div className="bg-white p-6 rounded-2xl shadow flex flex-col justify-between hover:shadow-lg transition">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <CreditCard size={18} /> Pay Rent
            </h3>
            <p className="text-gray-500 text-sm">Secure and instant payment</p>
          </div>

          <button
            onClick={handlePayment}
            disabled={paying}
            className={`mt-5 px-4 py-2 rounded-lg text-white transition ${
              paying
                ? "bg-gray-400"
                : "bg-green-600 hover:bg-green-700 hover:scale-105"
            }`}
          >
            {paying ? "Processing..." : `Pay ₹ ${lease.rent_amount}`}
          </button>
        </div>

        {/* 🛠 MAINTENANCE */}
        <div className="bg-white p-6 rounded-2xl shadow flex flex-col justify-between hover:shadow-lg transition">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Wrench size={18} /> Maintenance
            </h3>
            <p className="text-gray-500 text-sm">Report issues quickly</p>
          </div>

          <button
            onClick={() => navigate("/create-request")}
            className="mt-5 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 hover:scale-105 transition"
          >
            Create Request
          </button>
        </div>
      </div>

      {/* 💳 PAYMENT HISTORY */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Payment History</h3>

        {payments.length === 0 ? (
          <p className="text-gray-500 text-sm">No payments yet</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 border-b">
                <th className="py-2 text-left">Amount</th>
                <th className="text-left">Date</th>
              </tr>
            </thead>

            <tbody>
              {payments.map((p) => (
                <tr key={p._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 font-medium text-green-600">
                    ₹ {p.amount}
                  </td>
                  <td className="text-gray-500">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 📋 REQUESTS */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Maintenance Requests</h3>

        {requests.length === 0 ? (
          <p className="text-gray-500 text-sm">No requests yet</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 border-b">
                <th className="py-2 text-left">Title</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {requests.map((r) => (
                <tr key={r._id} className="border-b hover:bg-gray-50">
                  <td className="py-3">{r.title}</td>

                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        r.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : r.status === "In Progress"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default TenantDashboard;
