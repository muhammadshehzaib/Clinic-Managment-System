import mongoose, { model, Schema, models } from "mongoose";

const PatientSchema = new Schema(
  {
    title: { type: String, required: true },
    description: String,
    category: { type: mongoose.Types.ObjectId, ref: "Category" },
    age: {
      type: Number,
      required: true,
      min: 1,
      max: 90,
    },
    contactNumber: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          return /\d{11}/.test(value);
        },
        message: "Invalid contact number format (must be 11 digits)",
      },
    },
  },
  {
    timestamps: true,
  }
);

export const Patient = models.Patient || model("Patient", PatientSchema);
