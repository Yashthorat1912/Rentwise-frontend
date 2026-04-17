import { useState, useEffect } from "react";
import API from "../api/api";

function CreateRequest() {
  const [requests, setRequests] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [urgency, setUrgency] = useState("Low");
  const [files, setFiles] = useState([]); // ✅ NEW
  const [lease, setLease] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const leaseRes = await API.get("/leases/my");
      setLease(leaseRes.data);

      const res = await API.get(
        `/maintenance/my?lease_id=${leaseRes.data._id}`,
      );
      setRequests(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRequests = async () => {
    if (!lease) return;

    try {
      const res = await API.get(`/maintenance/my?lease_id=${lease._id}`);
      setRequests(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async () => {
    if (!title || !description) {
      alert("Please fill all fields");
      return;
    }

    try {
      // ✅ FORM DATA FOR FILE UPLOAD
      const formData = new FormData();
      formData.append("lease_id", lease._id);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("urgency", urgency);

      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]); // must match backend
      }

      await API.post("/maintenance", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // reset
      setTitle("");
      setDescription("");
      setUrgency("Low");
      setFiles([]);

      fetchRequests();
    } catch (err) {
      console.error(err);
      alert("Error creating request");
    }
  };

  const pending = requests.filter((r) => r.status === "Pending").length;
  const high = requests.filter((r) => r.urgency === "High").length;

  if (!lease) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen space-y-8">
      {/* 🔥 HEADER */}
      <div>
        <h1 className="text-2xl font-bold">Maintenance Requests</h1>
        <p className="text-gray-500 text-sm">
          Report and track issues in your property
        </p>
      </div>

      {/* 📊 STATS */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl shadow border">
          <p className="text-gray-500 text-sm">Total</p>
          <h2 className="text-2xl font-bold">{requests.length}</h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow border">
          <p className="text-gray-500 text-sm">Pending</p>
          <h2 className="text-2xl font-bold text-yellow-600">{pending}</h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow border">
          <p className="text-gray-500 text-sm">High Priority</p>
          <h2 className="text-2xl font-bold text-red-600">{high}</h2>
        </div>
      </div>

      {/* 🔥 MAIN GRID */}
      <div className="grid grid-cols-3 gap-6">
        {/* 🔹 LEFT: REQUEST LIST */}
        <div className="col-span-2 space-y-4">
          <h3 className="text-lg font-semibold">Recent Requests</h3>

          {requests.length === 0 ? (
            <div className="bg-white p-6 rounded-xl shadow text-center text-gray-500">
              No requests yet
            </div>
          ) : (
            requests.map((r) => (
              <div
                key={r._id}
                className="p-5 bg-white rounded-xl shadow hover:shadow-md transition space-y-2"
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold">{r.title}</h4>

                  <span
                    className={`px-3 py-1 text-xs rounded-full ${
                      r.urgency === "High"
                        ? "bg-red-100 text-red-600"
                        : r.urgency === "Medium"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-green-100 text-green-600"
                    }`}
                  >
                    {r.urgency}
                  </span>
                </div>

                <p className="text-gray-500 text-sm">{r.description}</p>

                <div className="flex justify-between items-center">
                  <span
                    className={`text-xs px-3 py-1 rounded-full ${
                      r.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : r.status === "In Progress"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                    }`}
                  >
                    {r.status}
                  </span>

                  <span className="text-xs text-gray-400">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* ✅ SHOW IMAGES */}
                {r.files?.length > 0 && (
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {r.files.map((f, i) => (
                      <img
                        key={i}
                        src={`${process.env.REACT_APP_API_URL}/${f}`}
                        alt="issue"
                        className="w-20 h-20 object-cover rounded-lg border"
                      />
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* 🔹 RIGHT: CREATE FORM */}
        <div className="bg-white p-6 rounded-xl shadow space-y-4">
          <h3 className="text-lg font-semibold">Create Request</h3>

          <input
            className="w-full p-2 border rounded-lg"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            className="w-full p-2 border rounded-lg"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <select
            className="w-full p-2 border rounded-lg"
            value={urgency}
            onChange={(e) => setUrgency(e.target.value)}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>

          {/* ✅ FILE INPUT */}
          <input
            type="file"
            multiple
            onChange={(e) => setFiles(e.target.files)}
            className="w-full text-sm"
          />

          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Create Request
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateRequest;
