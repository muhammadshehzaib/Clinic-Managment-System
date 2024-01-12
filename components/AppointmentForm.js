import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { io } from "socket.io-client";

const AppointmentForm = () => {
  const socket = io();
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    doctorId: "",
  });
  const [doctors, setDoctors] = useState([]);
  const router = useRouter();
  useEffect(() => {
    socketInitializer();
    axios.get("/api/doctors").then((result) => {
      setDoctors(result.data);
    });
  }, []);
  // Handle form input changes
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const socketInitializer = async () => {
    await fetch("/api/socket");
    socket.on("connect", () => {
      console.log("connected");
    });
    socket.on("update-input", (msg) => {
      // console.log("testing");
      // recall();
      // setFlag(true);
    });
  };

  const handleSubmit = async (e) => {
    const sockets = "socket";
    e.preventDefault();
    try {
      const result = await axios.post("/api/appointments", formData);
      setFormData(result.data);
      socket.emit("input-change", sockets);
      router.replace("/appointments");
    } catch (error) {
      console.error("Error scheduling appointment:", error);
    }
  };
  return (
    <div>
      <h2>Schedule an Appointment</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="time"
          id="startDate"
          name="startDate"
          value={formData.startDate}
          onChange={handleInputChange}
          required
        />
        <label htmlFor="endDate">End Time:</label>
        <input
          type="time"
          id="endDate"
          name="endDate"
          value={formData.endDate}
          onChange={handleInputChange}
          required
        />
        <label htmlFor="doctor">Select Doctor:</label>
        <select
          value={formData.doctorId}
          onChange={(ev) =>
            setFormData({
              ...formData,
              doctorId: ev.target.value,
            })
          }
        >
          <option value="">Select Doctor</option>
          {doctors.length > 0 &&
            doctors.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
        </select>
        <button
          type="submit"
          className="mt-4 bg-primary text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Schedule Appointment
        </button>
      </form>
    </div>
  );
};

export default AppointmentForm;
