import { mongooseConnect } from "@/lib/mongoose";
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
export default async function POST(req, res) {
  try {
    const { name, email, password } = await req.body;
    console.log(req.body);
    const hashedPassword = await bcrypt.hash(password, 10);
    await mongooseConnect();
    await User.create({ name, email, password: hashedPassword });
    return res.json({ message: "User registered." }, { status: 201 });
  } catch (error) {
    return res.json(
      { message: "An error occurred while registering the user." },
      { status: 500 }
    );
  }
}
