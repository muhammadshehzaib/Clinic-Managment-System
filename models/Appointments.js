import mongoose, { model, Schema, models } from "mongoose";

const AppointmentSchema = new Schema({
  Patients: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Patient",
    },
  ],
  Doctor: {
    type: mongoose.Types.ObjectId,
    ref: "Doctor",
  },
  startDate: {
    type: String,
    required: true,
  },
  endDate: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Reserved", "Not Reserved"],
    default: "Not Reserved",
  },
});

export const Appointment =
  models?.Appointment || model("Appointment", AppointmentSchema);
