import { useEffect, useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../utils/imageHelper"; // ✅ IMPORT

function LandlordDashboard() {
  const [requests, setRequests] = useState([]);
  const [properties, setProperties] = useState([]);
  const [tenants, setTenants] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const reqRes = await API.get("/maintenance");
      setRequests(reqRes.data || []);

      const propRes = await API.get("/properties");

      // ✅ HANDLE BOTH RESPONSE TYPES
      setProperties(propRes.data.data || propRes.data || []);

      const tenantRes = await API.get("/users/tenants");
      setTenants(tenantRes.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/maintenance/${id}`, { status });
      fetchData();
    } catch (err) {
      alert("Failed to update");
    }
  };

  const deleteProperty = async (id) => {
    if (!window.confirm("Delete this property?")) return;

    try {
      await API.delete(`/properties/${id}`);
      fetchData();
    } catch (err) {
      alert("Delete failed");
    }
  };

  const pending = requests.filter((r) => r.status === "Pending").length;
  const progress = requests.filter((r) => r.status === "In Progress").length;
  const completed = requests.filter((r) => r.status === "Completed").length;

  return (
    <div className="p-8 bg-gray-50 min-h-screen space-y-8">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Landlord Dashboard</h1>
          <p className="text-gray-500 text-sm">
            Manage properties, tenants & maintenance
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/add-property")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            + Property
          </button>

          <button
            onClick={() => navigate("/create-lease")}
            className="bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            + Lease
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow border">
          <p className="text-gray-500">Pending</p>
          <h2 className="text-2xl font-bold text-yellow-600">{pending}</h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow border">
          <p className="text-gray-500">In Progress</p>
          <h2 className="text-2xl font-bold text-blue-600">{progress}</h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow border">
          <p className="text-gray-500">Completed</p>
          <h2 className="text-2xl font-bold text-green-600">{completed}</h2>
        </div>
      </div>

      {/* PROPERTIES */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Properties</h3>

          <button
            onClick={() => navigate("/add-property")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
          >
            + Add Property
          </button>
        </div>

        {properties.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <p className="text-lg">No properties yet</p>
            <p className="text-sm">Start by adding your first property</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {properties.map((p) => (
              <div
                key={p._id}
                className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-xl transition"
              >
                {/* IMAGE */}
                <div className="relative">
                  <img
                    src={getImageUrl(p.coverImage)} // ✅ FIXED
                    alt="property"
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d";
                    }}
                    className="h-48 w-full object-cover"
                  />

                  <div className="absolute top-3 left-3 bg-white px-3 py-1 rounded-full text-sm font-semibold shadow">
                    ₹ {p.price}
                  </div>
                </div>

                {/* CONTENT */}
                <div className="p-4 space-y-1">
                  <h3 className="font-semibold text-lg">{p.title}</h3>
                  <p className="text-sm text-gray-500">{p.address}</p>

                  <div className="flex justify-between mt-3">
                    <button className="text-blue-600 text-sm">
                      View Details
                    </button>

                    <button
                      onClick={() => deleteProperty(p._id)}
                      className="text-red-500 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* TENANTS */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-lg font-semibold mb-4">Tenants</h3>

        {tenants.length === 0 ? (
          <p className="text-gray-500">No tenants</p>
        ) : (
          tenants.map((t) => (
            <div key={t._id} className="border-b py-2">
              {t.name} ({t.email})
            </div>
          ))
        )}
      </div>

      {/* REQUESTS */}
      <div className="grid md:grid-cols-2 gap-6">
        {requests.map((r) => (
          <div key={r._id} className="bg-white p-4 rounded-xl shadow space-y-2">
            <div className="flex justify-between">
              <h4 className="font-semibold">{r.title}</h4>
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                {r.urgency}
              </span>
            </div>

            <p className="text-sm text-gray-500">{r.description}</p>

            <span className="text-sm text-blue-600">{r.status}</span>

            {/* IMAGES */}
            {/* IMAGES */}
            {r.files && r.files.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {r.files.map((file, i) => {
                  // ✅ HANDLE ALL CASES
                  const filePath =
                    typeof file === "string"
                      ? file
                      : file?.path || file?.url || file?.secure_url;

                  if (!filePath) return null;

                  return (
                    <img
                      key={i}
                      src={getImageUrl(filePath)}
                      alt="request"
                      className="h-20 w-20 object-cover rounded border"
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d";
                      }}
                    />
                  );
                })}
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => updateStatus(r._id, "In Progress")}
                className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
              >
                Start
              </button>

              <button
                onClick={() => updateStatus(r._id, "Completed")}
                className="bg-green-500 text-white px-3 py-1 rounded text-sm"
              >
                Complete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LandlordDashboard;
