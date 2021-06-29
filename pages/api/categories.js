import { connectToDatabase } from "../../utils/mongodb";
export default async (req, res) => {
  const { SECRET } = process.env;
  const { db } = await connectToDatabase();
  if (req.method === "GET") {
    return new Promise(async (resolve, reject) => {
      const categories_data = await db
        .collection("Categories")
        .find()
        .project({ _id: 0, category: 1, brand: 1 })
        .toArray();
      res.json(categories_data);
      resolve();
    });
  }
};
