import { mongooseConnect } from "@/lib/mongoose";
import { Appointment } from "@/models/Appointments";
import { Doctor } from "@/models/Doctor";
import { NextResponse } from "next/server";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();

  if (method === "POST") {
    const { startDate, endDate, doctorId } = await req.body;

    let doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return NextResponse.json({
        message: "Doctor not found",
        status: 404,
      });
    }

    const formattedStartDate = new Date(`2000-01-01T${startDate}`);
    const formattedEndDate = new Date(`2000-01-01T${endDate}`);

    const appointment = await Appointment.create({
      startDate: formattedStartDate.toLocaleTimeString([], {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }),
      endDate: formattedEndDate.toLocaleTimeString([], {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }),
      Doctor: doctorId,
    });
    console.log(doctorId);
    console.log(appointment);
    console.log(startDate, endDate, doctorId);

    console.log(appointment);
    let appointmentId = appointment._id;
    console.log(appointmentId);
    doctor.Appointment.push(appointmentId);
    await doctor.save();
    return res.json(appointment);
  }

  if (method === "GET") {
    const appointment = await Appointment.find({}).populate("Doctor");
    res.json(appointment);
  }

  if (method === "PUT") {
    const { _id } = await req.body;

    const categoryDoc = await Appointment.updateOne(
      { _id },
      {
        status: "Reserved",
      }
    );
    res.json(categoryDoc);
  }
  if (method === "DELETE") {
    const { id } = req.query;
    await Appointment.deleteOne({ _id: id });

    res.json("ok");
  }
}
