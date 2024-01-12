import mongoose, { model, models, Schema } from "mongoose";
let bcrypt = require("bcryptjs");

const DoctorSchema = new Schema({
  name: { type: String, required: true },
  // parent: { type: mongoose.Types.ObjectId, ref: "Patient" },
  // properties: [{ type: Object }],
  age: {
    type: Number,
    required: true,
    min: 1,
    max: 90,
  },
  specialization: {
    type: String,
    // required: true,
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
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: function (value) {
        return /\S+@\S+\.\S+/.test(value);
      },
      message: "Invalid email format",
    },
  },
  Appointment: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Appointment",
    },
  ],

  // password: {
  //   type: String,
  //   required: true,
  //   minlength: 8, // You can adjust the minimum length as needed
  // },
});

// DoctorSchema.pre("save", async function (next) {
//   const doctor = this;

//   if (doctor.isModified("password") || doctor.isNew) {
//     try {
//       const hashedPassword = await bcrypt.hash(doctor.password, 10);
//       doctor.password = hashedPassword;
//       next();
//     } catch (error) {
//       next(error);
//     }
//   } else {
//     return next();
//   }
// });

export const Doctor = models?.Doctor || model("Doctor", DoctorSchema);
