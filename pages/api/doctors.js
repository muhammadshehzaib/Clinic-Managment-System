// import {Category} from "@/models/Category";
import { mongooseConnect } from "@/lib/mongoose";
import { Doctor } from "@/models/Doctor";
import { isAdminRequest } from "@/pages/api/auth/[...nextauth]";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();
  // await isAdminRequest(req, res);

  if (method === "GET") {
    res.json(await Doctor.find());
  }

  if (method === "POST") {
    const {
      name,
      // parentCategory,
      age,
      specialization,
      contactNumber,
      // email,
      // password,
    } = req.body;
    const categoryDoc = await Doctor.create({
      name,
      // parent: parentCategory || undefined,
      age,
      specialization,
      contactNumber,
      // email,
      // password,
    });
    res.json(categoryDoc);
  }

  if (method === "PUT") {
    const {
      name,
      // parentCategory,
      _id,
      age,
      specialization,
      contactNumber,
      // email,
      // password,
    } = req.body;
    const categoryDoc = await Doctor.updateOne(
      { _id },
      {
        name,
        // parent: parentCategory || undefined,
        age,
        specialization,
        contactNumber,
        email,
        // password,
      }
    );
    res.json(categoryDoc);
  }

  if (method === "DELETE") {
    const { _id } = req.query;
    await Doctor.deleteOne({ _id });
    res.json("ok");
  }
}
