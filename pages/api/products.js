import { connectToDatabase } from "../../utils/mongodb";
import cookie from "cookie";
export default async (req, res) => {
  const { SECRET } = process.env;
  const { db } = await connectToDatabase();
  if (req.method === "GET") {
    return new Promise(async (resolve, reject) => {
      const brandArray = req.query.brand.split(",");
      const pageNumber = req.query.pageNumber;
      const nPerPage = req.query.nPerPage;
      const userMinPrice = req.query.userMinPrice;
      const userMaxPrice = req.query.userMaxPrice;
      const userSort = req.query.sort;
      const minPrice = await db
        .collection("Items")
        .find({
          category: req.query.category,
          brand: { $in: brandArray },
        })
        .project({ _id: 0, price: 1 })
        .sort({ price: 1 })
        .limit(1)
        .toArray();
      const maxPrice = await db
        .collection("Items")
        .find({
          category: req.query.category,
          brand: { $in: brandArray },
        })
        .project({ _id: 0, price: 1 })
        .sort({ price: -1 })
        .limit(1)
        .toArray();
      const items = await db
        .collection("Items")
        .find({
          category: req.query.category,
          brand: { $in: brandArray },
        })
        .project({ _id: 0, name: 1, price: 1 })
        .sort({ price: parseInt(userSort) })
        .skip(pageNumber > 0 ? (pageNumber - 1) * nPerPage : 0)
        .limit(parseInt(nPerPage))
        .toArray();
      //res.end(typeof brandArray);
      res.json({
        minPrice: minPrice[0].price,
        maxPrice: maxPrice[0].price,
        items: items,
      });
      resolve();
    });
  }
};
