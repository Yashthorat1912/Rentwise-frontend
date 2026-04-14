import { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

function AddProperty() {
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);

  const navigate = useNavigate();

  const handleAdd = async () => {
    if (!title || !address || !price) {
      alert("Fill all fields");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("address", address);
    formData.append("price", price);
    formData.append("image", image);

    try {
      await API.post("/properties", formData);

      alert("Property added!");
      navigate("/landlord");
    } catch (err) {
      console.error(err);
      alert("Failed to add property");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow rounded-xl mt-10 space-y-4">
      <h2 className="text-xl font-bold">Add Property</h2>

      <input
        placeholder="Property Title"
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        placeholder="Address"
        className="input"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />

      <input
        placeholder="Price"
        type="number"
        className="input"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      {image && (
        <img
          src={URL.createObjectURL(image)}
          alt="preview"
          className="h-40 w-full object-cover rounded-lg"
        />
      )}
      <input type="file" onChange={(e) => setImage(e.target.files[0])} />

      <button onClick={handleAdd} className="btn w-full">
        Add Property
      </button>
    </div>
  );
}

export default AddProperty;
