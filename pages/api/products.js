import { connectToDatabase } from "../../utils/mongodb";
import cookie from "cookie";
export default async (req, res) => {
  const { SECRET } = process.env;
  const { db } = await connectToDatabase();
  if (req.method === "GET") {
    return new Promise(async (resolve, reject) => {
      const products = await db
        .collection("Items")
        .find({ category: req.query.category })
        .project({ _id: 0, category: 1, brand: 1 })
        .toArray();
      res.json(cookie.parse(req.headers.cookie || ""));
      resolve();
    });
  }
};
