import { connectToDatabase } from "../../utils/mongodb";
import { verify } from "jsonwebtoken";
import { ObjectID } from "mongodb";
export default async (req, res) => {
  const { SECRET } = process.env;
  const { db } = await connectToDatabase();
  if (req.method === "POST") {
    if (req.body.type === "INSERT") {
      return new Promise((resolve, reject) => {
        verify(req.cookies.auth, SECRET, async function (err, decoded) {
          if (!err && decoded) {
            const user_id = new ObjectID(decoded.sub);
            const result = await db.collection("Orders").insertOne({
              createdAt: new Date().toLocaleString(),
              orderId: req.body.id,
              name: req.body.name,
              email: req.body.email,
              city: req.body.city,
              address: req.body.address,
              phoneNumber: req.body.phoneNumber,
              items: req.body.cart,
              totalSum: req.body.total,
              userType: 1,
              payStatus: "PENDING",
              riskLevel: -1,
              riskTitle: "",
              payLink: "",
            });
            await db.collection("Users").findOneAndUpdate(
              {
                _id: user_id,
              },
              { $set: { cart: [] } }
            );
            const order = req.body;
            order.tran_id = result.insertedId;
            res.json({ message: "success", data: order });
            resolve();
          } else {
            verify(req.cookies.tempAuth, SECRET, async function (err, decoded) {
              if (!err && decoded) {
                const ob_id = new ObjectID(decoded.sub);
                const result = await db.collection("Orders").insertOne({
                  createdAt: new Date().toLocaleString(),
                  orderId: req.body.id,
                  name: req.body.name,
                  email: req.body.email,
                  city: req.body.city,
                  address: req.body.address,
                  phoneNumber: req.body.phoneNumber,
                  items: req.body.cart,
                  totalSum: req.body.total,
                  userType: 0,
                  payStatus: "PENDING",
                  riskLevel: -1,
                  riskTitle: "",
                  payLink: "",
                });
                await db.collection("tempUser").findOneAndUpdate(
                  {
                    _id: ob_id,
                  },
                  { $set: { cart: [] } }
                );
                const order = req.body;
                order.tran_id = result.insertedId;
                res.json({ message: "success", data: order });
                resolve();
              }
            });
          }
        });
      });
    } else if (req.body.type === "UPDATE") {
      ///update order status
    }
  } else if (req.method === "GET") {
    return new Promise((resolve, reject) => {
      verify(req.cookies.auth, SECRET, async function (err, decoded) {
        if (!err && decoded) {
          const user_id = new ObjectID(decoded.sub);
          const email = await db
            .collection("Users")
            .find({ _id: user_id })
            .project({ _id: 0, email: 1 })
            .toArray();
          const orders = await db
            .collection("Orders")
            .find({ email: email[0].email, userType: 1 })
            .toArray();
          res.json({ message: "success", order: orders });
          resolve();
        } else {
          res.json({ message: "error" });
          resolve();
        }
      });
    });
  }
};
