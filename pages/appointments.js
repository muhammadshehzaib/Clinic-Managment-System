import Layout from "@/components/Layout";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

import { useSession } from "next-auth/react";

export default function Products() {
  const socket = io();
  const { data: session } = useSession();

  const [appointment, setAppointment] = useState([]);
  const [flag, setFlag] = useState(false);

  useEffect(() => {
    socketInitializer();
    recall();
  }, []);

  function recall() {
    axios.get("/api/appointments").then((response) => {
      setAppointment(response.data);
      console.log("In recall function");
    });
  }

  const socketInitializer = async () => {
    await fetch("/api/socket");
    socket.on("connect", () => {
      console.log("connected");
    });
    socket.on("update-input", (msg) => {
      // console.log("testing");
      recall();
      setFlag(true);
    });
  };

  // console.log(flag);

  const handleStatusToggle = (_id) => {
    let sockets = "socket";
    // socket.emit("input-change", shehzaib);
    setFlag(true);
    axios.put("/api/appointments", { _id }).then((response) => {
      if (response.status === 200) {
        // console.log(response.status);
        socket.emit("input-change", sockets);
        recall();
        setFlag(true);
      }
    });
  };
  // console.log(appointment);
  async function deleteProduct(_id) {
    await axios.delete("/api/appointments?id=" + _id);
    recall();
  }

  return (
    <Layout>
      <h2 className="text-2xl font-bold text-center">Appointments</h2>
      <div className="flex justify-between items-center mb-4">
        {session?.user?.email === "m.shehzaib.b@gmail.com" ? (
          <Link className="btn-primary" href={"/appointments/new"}>
            Add new Appointment
          </Link>
        ) : (
          ""
        )}
      </div>

      <table className="table-auto w-full border-collapse mt-6">
        <thead>
          <tr className="border-t border-b">
            <th className="py-2 px-4">Start Time</th>
            <th className="py-2 px-4">End Time</th>
            <th className="py-2 px-4">Status</th>
            <th className="py-2 px-4">Doctors</th>
          </tr>
        </thead>
        <tbody>
          {appointment.map((appointment) => (
            <tr key={appointment._id} className="border-t border-b">
              <td className="py-2 px-4 text-center">{appointment.startDate}</td>
              <td className="py-2 px-4 text-center">{appointment.endDate}</td>
              <td className="flex justify-center py-2 px-4 text-center">
                <button
                  type="button"
                  onClick={() => {
                    handleStatusToggle(appointment._id);
                  }}
                  className={`py-2 px-4 rounded-md transition duration-300 ${
                    appointment.status === "Not Reserved"
                      ? "bg-blue-500 text-white"
                      : "bg-green-500 text-white"
                  }`}
                >
                  {appointment.status}
                </button>
              </td>
              <td className="py-2 px-4 text-center text-black">
                {appointment?.Doctor?.name}
              </td>
              <td
                className="py-2 px-4 text-center "
                onClick={() => deleteProduct(appointment._id)}
              >
                <button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-full">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
}

{
  /* <Link
                  className="btn-default"
                  href={"/appointments/edit/" + appointments._id}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                    />
                  </svg>
                  Edit
                </Link>
                <Link
                  className="btn-red"
                  href={"/appointments/delete/" + appointment._id}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                    />
                  </svg>
                  Delete
                </Link> */
}
