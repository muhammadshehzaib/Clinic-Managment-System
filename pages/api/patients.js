import { Patient } from "@/models/Patient";
import { mongooseConnect } from "@/lib/mongoose";
import { isAdminRequest } from "@/pages/api/auth/[...nextauth]";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();
  // await isAdminRequest(req, res);

  if (method === "GET") {
    if (req.query?.id) {
      res.json(await Patient.findOne({ _id: req.query.id }));
    } else {
      res.json(await Patient.find());
    }
  }

  if (method === "POST") {
    const { title, description, price, category, age, contactNumber } =
      req.body;
    const productDoc = await Patient.create({
      title,
      description,
      category,
      age,
      contactNumber,
    });
    res.json(productDoc);
  }

  if (method === "PUT") {
    const { title, description, price, category, _id, age, contactNumber } =
      req.body;
    await Patient.updateOne(
      { _id },
      {
        title,
        description,
        category,
        age,
        contactNumber,
      }
    );

    res.json(true);
  }

  if (method === "DELETE") {
    if (req.query?.id) {
      await Patient.deleteOne({ _id: req.query?.id });
      res.json(true);
    }
  }
}
