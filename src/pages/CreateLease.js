import { useEffect, useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

function CreateLease() {
  const [properties, setProperties] = useState([]);
  const [tenants, setTenants] = useState([]);

  const [propertyId, setPropertyId] = useState("");
  const [tenantId, setTenantId] = useState("");
  const [rent, setRent] = useState("");
  const [file, setFile] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const propRes = await API.get("/properties");
    setProperties(propRes.data);

    const tenantRes = await API.get("/users/tenants");
    setTenants(tenantRes.data);
  };

  const handleCreate = async () => {
    if (!propertyId || !tenantId || !rent) {
      alert("Fill all fields");
      return;
    }

    const formData = new FormData();
    formData.append("property_id", propertyId);
    formData.append("tenant_id", tenantId);
    formData.append("rent_amount", rent);
    formData.append("document", file);

    try {
      await API.post("/leases", formData);

      alert("Lease created!");
      navigate("/landlord");
    } catch (err) {
      console.error(err);
      alert("Failed to create lease");
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-xl shadow mt-10 space-y-4">
      <h2 className="text-xl font-bold">Create Lease</h2>

      <select className="input" onChange={(e) => setPropertyId(e.target.value)}>
        <option>Select Property</option>
        {properties.map((p) => (
          <option key={p._id} value={p._id}>
            {p.title}
          </option>
        ))}
      </select>

      <select className="input" onChange={(e) => setTenantId(e.target.value)}>
        <option>Select Tenant</option>
        {tenants.map((t) => (
          <option key={t._id} value={t._id}>
            {t.name}
          </option>
        ))}
      </select>

      <input
        placeholder="Rent Amount"
        type="number"
        className="input"
        onChange={(e) => setRent(e.target.value)}
      />

      <input type="file" onChange={(e) => setFile(e.target.files[0])} />

      <button onClick={handleCreate} className="btn w-full">
        Create Lease
      </button>
    </div>
  );
}

export default CreateLease;
