import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  category: assignedCategory,
  properties: assignedProperties,
  age: assignedAge,
  email: assignedEmail,
  contactNumber: assignedcontactNumber,
}) {
  const [title, setTitle] = useState(existingTitle || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [category, setCategory] = useState(assignedCategory || "");
  const [productProperties, setProductProperties] = useState(
    assignedProperties || {}
  );
  const [age, setAge] = useState(assignedAge || "");
  const [contactNumber, setContactNumber] = useState(
    assignedcontactNumber || ""
  );
  const [price, setPrice] = useState(existingPrice || "");
  const [goToProducts, setGoToProducts] = useState(false);
  const [categories, setCategories] = useState([]);
  const router = useRouter();
  useEffect(() => {
    axios.get("/api/doctors").then((result) => {
      setCategories(result.data);
    });
  }, []);
  async function saveProduct(ev) {
    ev.preventDefault();
    const data = {
      title,
      description,
      price,
      category,
      properties: productProperties,
      age,
      contactNumber,
    };
    if (_id) {
      //update
      await axios.put("/api/patients", { ...data, _id });
    } else {
      //create
      await axios.post("/api/patients", data);
    }
    setGoToProducts(true);
  }
  if (goToProducts) {
    router.push("/patients");
  }

  const handlecontactNumberChange = (event) => {
    const value = event.target.value;

    const sanitizedValue = value.replace(/\D/g, "");

    if (!isNaN(sanitizedValue) && sanitizedValue.length <= 11) {
      setContactNumber(sanitizedValue); // Update the state with the valid contact number
    }
  };
  const handleAgeChange = (event) => {
    const value = parseInt(event.target.value, 10);

    if (!isNaN(value) && value >= 1 && value <= 90) {
      setAge(value.toString());
    }
  };
  return (
    <form onSubmit={saveProduct}>
      <label>Patient name</label>
      <input
        type="text"
        placeholder="patient name"
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      />
      <label>Doctor Appointment</label>
      <select value={category} onChange={(ev) => setCategory(ev.target.value)}>
        <option value="">Unassigned</option>
        {categories.length > 0 &&
          categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
      </select>
      <label>Description</label>
      <textarea
        placeholder="description"
        value={description}
        onChange={(ev) => setDescription(ev.target.value)}
      />
      <label>Fees (in PKR)</label>
      <input
        type="number"
        placeholder="price"
        value={price}
        onChange={(ev) => setPrice(ev.target.value)}
      />
      <label htmlFor="age">Age</label>
      <input
        type="number"
        id="age"
        value={age}
        onChange={handleAgeChange}
        placeholder="Enter age (1-90)"
        min="1"
        max="90"
      />
      <label htmlFor="contactNumber">Contact No</label>
      <input
        type="tel"
        id="contactNumber"
        value={contactNumber}
        onChange={handlecontactNumberChange}
        placeholder="Enter contact number (up to 11 digits)"
      />
      <button type="submit" className="btn-primary">
        Save
      </button>
    </form>
  );
}
