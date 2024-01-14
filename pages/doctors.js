import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import { withSwal } from "react-sweetalert2";

function Doctor({ swal }) {
  const [editedCategory, setEditedCategory] = useState(null);
  const [name, setName] = useState("");
  const [parentCategory, setParentCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [age, setAge] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  // const [email, setEmail] = useState("");
  const [specialization, setSpecialization] = useState("");
  // const [password, setPassword] = useState("");

  // const handleEmailChange = (event) => {
  //   const value = event.target.value;
  //   const isValidEmail = /\S+@\S+\.\S+/.test(value);
  //   if (isValidEmail) {
  //     setEmail(value);
  //   }
  // };

  const handlecontactNumberChange = (event) => {
    const value = event.target.value;

    const sanitizedValue = value.replace(/\D/g, "");
    if (!isNaN(sanitizedValue) && sanitizedValue.length <= 11) {
      setContactNumber(sanitizedValue);
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);
  function fetchCategories() {
    axios.get("/api/doctors").then((result) => {
      setCategories(result.data);
    });
  }
  async function saveCategory(ev) {
    ev.preventDefault();
    const data = {
      name,
      parentCategory,
      age,
      specialization,
      contactNumber,
      // email,
      // password,
    };
    if (editedCategory) {
      data._id = editedCategory._id;
      await axios.put("/api/doctors", data);
      setEditedCategory(null);
    } else {
      await axios.post("/api/doctors", data);
    }
    setName("");
    setParentCategory("");
    setAge("");
    setSpecialization("");
    setContactNumber("");
    // setEmail("");
    // setPassword("");
    fetchCategories();
  }

  function editCategory(category) {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category.parent?._id);
    setAge(category.age);
    setSpecialization(category.specialization);
    setContactNumber(category.contactNumber), setEmail(category.email);
    // setPassword(category.password);
    fetchCategories();
  }
  function deleteCategory(category) {
    swal
      .fire({
        title: "Are you sure?",
        text: `Do you want to delete ${category.name}?`,
        showCancelButton: true,
        cancelButtonText: "Cancel",
        confirmButtonText: "Yes, Delete!",
        confirmButtonColor: "#d55",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          const { _id } = category;
          await axios.delete("/api/doctors?_id=" + _id);
          fetchCategories();
        }
      });
  }
  const handleAgeChange = (event) => {
    const value = parseInt(event.target.value, 10);

    if (!isNaN(value) && value >= 1 && value <= 90) {
      setAge(value.toString());
    }
  };

  return (
    <Layout>
      <h1>Doctor</h1>
      <label>
        {editedCategory
          ? `Edit Doctor data ${editedCategory.name}`
          : "Add Doctor data"}
      </label>

      <form onSubmit={saveCategory}>
        <div className="flex gap-1 flex-col">
          <label htmlFor="">Name</label>
          <input
            type="text"
            placeholder={"Doctor name"}
            onChange={(ev) => setName(ev.target.value)}
            value={name}
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
          <label htmlFor="">Specialization</label>
          <input type="text" />
          <label htmlFor="contactNumber">Contact No</label>
          <input
            type="tel"
            id="contactNumber"
            value={contactNumber}
            onChange={handlecontactNumberChange}
            placeholder="Enter contact number (up to 11 digits)"
          />
        </div>

        <div className="flex gap-1">
          {editedCategory && (
            <button
              type="button"
              onClick={() => {
                setEditedCategory(null);
                setName("");
                setParentCategory("");
                setProperties([]);
                setSpecialization("");
                setContactNumber("");
                // setEmail("");
                // setPassword("");
              }}
              className="btn-default"
            >
              Cancel
            </button>
          )}
          <button type="submit" className="btn-primary py-1">
            Save
          </button>
        </div>
      </form>
      {!editedCategory && (
        <table className="basic mt-4">
          <thead>
            <tr>
              <td>Doctor Name</td>
            </tr>
          </thead>

          <tbody>
            {categories.length > 0 &&
              categories.map((category) => (
                <tr key={category._id}>
                  <td>{category.name}</td>
                  <td>{category?.parent?.name}</td>
                  <td>
                    <button
                      onClick={() => editCategory(category)}
                      className="btn-default mr-1"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteCategory(category)}
                      className="btn-red"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
}

export default withSwal(({ swal }, ref) => <Doctor swal={swal} />);
