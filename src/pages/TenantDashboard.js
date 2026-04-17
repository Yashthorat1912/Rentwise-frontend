import { useEffect, useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";
import { Home, CreditCard, Wrench, FileText } from "lucide-react";
import { getImageUrl } from "../utils/imageHelper"; // ✅ USE GLOBAL

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
      const leaseData = leaseRes.data.data || leaseRes.data;

      if (!leaseData?._id) return;

      setLease(leaseData);

      const reqRes = await API.get(`/maintenance/my?lease_id=${leaseData._id}`);
      setRequests(reqRes.data.data || reqRes.data || []);

      const payRes = await API.get(`/payments/${leaseData._id}`);
      setPayments(payRes.data.data || payRes.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const isPaidThisMonth = () => {
    const now = new Date();

    return payments.some((p) => {
      const d = new Date(p.createdAt);
      return (
        d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      );
    });
  };

  const handlePayment = async () => {
    try {
      setPaying(true);

      await API.post("/payments", {
        lease_id: lease._id,
        amount: lease.rent_amount,
      });

      fetchData();
    } catch {
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
        <p className="text-gray-500 mt-2">Contact your landlord</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 bg-gray-100 min-h-screen space-y-8">
      {/* 🔥 HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Home /> Dashboard
        </h1>

        <button
          onClick={() => navigate("/chat")}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
        >
          Chat
        </button>
      </div>

      {/* 🏠 PROPERTY HERO */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <img
          src={getImageUrl(lease.property_id?.coverImage)} // ✅ FIXED
          alt="property"
          className="w-full h-64 object-cover"
        />

        <div className="p-6">
          <h2 className="text-2xl font-bold">{lease.property_id?.title}</h2>

          <p className="text-gray-500">📍 {lease.property_id?.address}</p>

          <p className="text-indigo-600 font-bold text-xl mt-2">
            ₹ {lease.rent_amount} / month
          </p>
        </div>
      </div>

      {/* 📊 STATS */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card title="Monthly Rent" value={`₹ ${lease.rent_amount}`} />

        <Card title="Requests" value={requests.length} />

        <Card
          title="Payment Status"
          value={isPaidThisMonth() ? "Paid ✅" : "Due ❌"}
        />
      </div>

      {/* 📄 LEASE */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h3 className="font-semibold text-lg mb-4 flex gap-2">
          <FileText /> Lease
        </h3>

        {lease.lease_document_url ? (
          <a
            href={getImageUrl(lease.lease_document_url)}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 underline"
          >
            View Lease Document
          </a>
        ) : (
          <p className="text-gray-400">No document</p>
        )}
      </div>

      {/* ⚡ ACTIONS */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* 💳 PAYMENT */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="font-semibold flex gap-2">
            <CreditCard /> Pay Rent
          </h3>

          <button
            onClick={handlePayment}
            disabled={isPaidThisMonth() || paying}
            className={`mt-4 w-full py-2 rounded-lg text-white ${
              isPaidThisMonth()
                ? "bg-gray-400"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {isPaidThisMonth()
              ? "Already Paid"
              : paying
                ? "Processing..."
                : "Pay Now"}
          </button>
        </div>

        {/* 🛠 MAINTENANCE */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="font-semibold flex gap-2">
            <Wrench /> Maintenance
          </h3>

          <button
            onClick={() => navigate("/create-request")}
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Create Request
          </button>
        </div>
      </div>

      {/* 📋 REQUESTS */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h3 className="font-semibold text-lg mb-4">Maintenance Requests</h3>

        {requests.length === 0 ? (
          <p className="text-gray-500">No requests yet</p>
        ) : (
          <div className="space-y-4">
            {requests.map((r) => (
              <div key={r._id} className="border p-4 rounded-xl hover:shadow">
                <h4 className="font-semibold">{r.title}</h4>

                <p className="text-sm text-gray-500">{r.description}</p>

                {/* 🖼 IMAGES */}
                {r.files?.length > 0 && (
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {r.files.map((f, i) => {
                      const fileUrl =
                        typeof f === "string" ? f : f.url || f.path || "";

                      return (
                        <img
                          key={i}
                          src={getImageUrl(fileUrl)}
                          alt="issue"
                          onError={(e) => {
                            e.target.src =
                              "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d";
                          }}
                          className="h-16 w-16 object-cover rounded"
                        />
                      );
                    })}
                  </div>
                )}

                <span className="text-xs mt-2 inline-block">{r.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// 🔹 REUSABLE CARD
function Card({ title, value }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-xl font-bold mt-2">{value}</h2>
    </div>
  );
}

export default TenantDashboard;
