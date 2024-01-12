import { mongooseConnect } from "@/lib/mongoose";
import User from "@/models/User";
import { NextResponse } from "next/server";

export default async function POST(req, res) {
  try {
    await mongooseConnect();
    const { email } = await req.body;
    const user = await User.findOne({ email }).select("_id");
    console.log("user: ", user);
    return res.json({ user });
    // return NextResponse.json({ user });
  } catch (error) {
    console.log(error);
  }
}
