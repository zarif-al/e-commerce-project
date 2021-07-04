import { connectToDatabase } from "../../utils/mongodb";
import cookie from "cookie";
export default async (req, res) => {
  const { SECRET } = process.env;
  const { db } = await connectToDatabase();
  if (req.method === "GET") {
    return new Promise(async (resolve, reject) => {
      const brandArray = req.query.brand.split(",");
      const pageNumber = parseInt(req.query.pageNumber);
      const nPerPage = parseInt(req.query.nPerPage);
      const userMinPrice = parseInt(req.query.userMinPrice);
      const userMaxPrice = parseInt(req.query.userMaxPrice);
      const userSort = parseInt(req.query.sort);
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
          price: {
            $gte: userMinPrice == 0 ? minPrice[0].price : userMinPrice,
            $lte: userMaxPrice == 0 ? maxPrice[0].price : userMaxPrice,
          },
        })
        .project({
          category: 1,
          name: 1,
          price: 1,
          description: 1,
          imageLink: 1,
        })
        .sort({ price: userSort })
        .skip(pageNumber > 0 ? (pageNumber - 1) * nPerPage : 0)
        .limit(nPerPage)
        .toArray();
      const totalCount = await db
        .collection("Items")
        .find({
          category: req.query.category,
          brand: { $in: brandArray },
          price: {
            $gte: userMinPrice == 0 ? minPrice[0].price : userMinPrice,
            $lte: userMaxPrice == 0 ? maxPrice[0].price : userMaxPrice,
          },
        })
        .count();
      //res.end(typeof brandArray);
      res.json({
        totalCount: totalCount,
        minPrice: minPrice[0].price,
        maxPrice: maxPrice[0].price,
        items: items,
      });
      resolve();
    });
  }
};
