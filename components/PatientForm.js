import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,

  category: assignedCategory,
  properties: assignedProperties,
  age: assignedAge,
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
  const [goToProducts, setGoToProducts] = useState(false);
  const [categories, setCategories] = useState([]);
  const router = useRouter();
  useEffect(() => {
    axios.get("/api/doctors").then((result) => {
      setCategories(result.data);
    });
  }, []);
  const formik = useFormik({
    initialValues: {
      title: existingTitle || "",
      description: existingDescription || "",
      contactNumber: assignedcontactNumber || "",
      age: assignedAge || "",
      category: assignedCategory || "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Patient Name is required"),
      description: Yup.string().required("Description is required"),
      age: Yup.number()
        .required("Age is required")
        .max(100, "Age must be less than 100"),
      contactNumber: Yup.string()
        .required("Contact No. is required")
        .matches(/^\d{11}$/, "Contact No. must be exactly 11 digits"),
      age: Yup.number()
        .required("Age is required")
        .min(0, "Age must be greater than or equal to 0")
        .max(100, "Age must be less than or equal to 100"),
      category: Yup.string().required("Please Select a doctor"),
    }),
    onSubmit: async (values) => {
      const data = {
        title,
        description,
        age,
        contactNumber,
        category,
      };
      try {
        if (_id) {
          // Update
          const response = await axios.put("/api/patients", { ...data, _id });
          if (response.status === 200) {
            console.log("Product updated successfully");
            Toast.fire({
              icon: "success",
              title: "Successfully Updated",
            });
          } else {
            Toast.fire({
              icon: "error",
              title: "Failed to Update",
            });
            console.error("Failed to update product");
          }
        } else {
          const response = await axios.post("/api/patients", data);
          if (response.status === 201) {
            // alert('Product created successfully');
            Toast.fire({
              icon: "success",
              title: "Successfully Inserted",
            });
            console.log("Product created successfully");
          } else {
            Toast.fire({
              icon: "error",
              title: "Failed to Create",
            });
            console.error("Failed to create product");
          }
        }
      } catch (error) {
        console.error("Error:", error.message);
      }
      setGoToProducts(true);
    },
  });

  if (goToProducts) {
    router.push("/patients");
  }

  return (
    <form onSubmit={formik.handleSubmit}>
      <label>Patient name</label>
      <input
        type="text"
        placeholder="patient name"
        value={formik.values.title}
        name="title"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
      {formik.touched.title && formik.errors.title ? (
        <div className="text-red-500 text-xs">{formik.errors.title}</div>
      ) : null}

      <label>Doctor Appointment</label>
      <select
        value={formik.values.category}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        name="category"
      >
        <option value="">Unassigned</option>
        {categories.length > 0 &&
          categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
      </select>
      {formik.touched.category && formik.errors.category ? (
        <div className="text-red-500 text-xs">{formik.errors.category}</div>
      ) : null}

      <label>Description</label>
      <textarea
        placeholder="description"
        value={formik.values.description}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        name="description"
      />
      {formik.touched.description && formik.errors.description ? (
        <div className="text-red-500 text-xs">{formik.errors.description}</div>
      ) : null}
      <label htmlFor="age">Age</label>
      <input
        type="number"
        id="age"
        placeholder="Enter age"
        min="1"
        max="90"
        value={formik.values.age}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        name="age"
      />
      {formik.touched.age && formik.errors.age ? (
        <div className="text-red-500 text-xs">{formik.errors.age}</div>
      ) : null}
      <label htmlFor="contactNumber">Contact No</label>
      <input
        type="tel"
        id="contactNumber"
        placeholder="Enter contact number (up to 11 digits)"
        value={formik.values.contactNumber}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        name="contactNumber"
      />
      {formik.touched.contactNumber && formik.errors.contactNumber ? (
        <div className="text-red-500 text-xs">
          {formik.errors.contactNumber}
        </div>
      ) : null}
      <button type="submit" className="btn-primary mt-2">
        Save
      </button>
    </form>
  );
}
