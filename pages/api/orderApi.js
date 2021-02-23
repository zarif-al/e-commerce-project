import { connectToDatabase } from "../../utils/mongodb";
import { verify } from "jsonwebtoken";
import { ObjectID } from "mongodb";
import { getSession } from "next-auth/client";
export default async (req, res) => {
  const { SECRET } = process.env;
  const { db } = await connectToDatabase();
  if (req.method === "POST") {
    const session = await getSession({ req });
    if (req.body.type === "INSERT") {
      if (session) {
        return new Promise(async (resolve, reject) => {
          const result = await db.collection("orders").insertOne({
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
          await db.collection("users").findOneAndUpdate(
            {
              email: session.user.email,
            },
            { $set: { cart: [] } }
          );
          const order = req.body;
          order.tran_id = result.insertedId;
          res.json({ message: "success", data: order });
          resolve();
        });
      } else {
        return new Promise(async (resolve, reject) => {
          verify(req.cookies.tempAuth, SECRET, async function (err, decoded) {
            if (!err && decoded) {
              const ob_id = new ObjectID(decoded.sub);
              const result = await db.collection("orders").insertOne({
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
        });
      }
    }
  } else if (req.method === "GET") {
    const session = await getSession({ req });
    if (session) {
      return new Promise(async (resolve, reject) => {
        const orders = await db
          .collection("orders")
          .find({ email: session.user.email, userType: 1 })
          .project({ _id: 0 })
          .toArray();
        res.json({ message: "success", order: orders });
        resolve();
      });
    } else {
      return new Promise(async (resolve, reject) => {
        res.json({ message: "error" });
        resolve();
      });
    }
  }
};
