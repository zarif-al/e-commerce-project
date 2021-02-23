import { connectToDatabase } from "../../utils/mongodb";
import { ObjectID } from "mongodb";
import { sendMail } from "../../functions/mailer";
import { postBodyCreate } from "../../functions/postBodyCreate";
const { STORE_ID, STORE_PASSWD } = process.env;
const SSLCommerz = require("sslcommerz-nodejs");
let settings = {
  isSandboxMode: true,
  store_id: STORE_ID,
  store_passwd: STORE_PASSWD,
};
let sslcommerz = new SSLCommerz(settings);

export default async (req, res) => {
  if (req.method === "POST") {
    const { db } = await connectToDatabase();
    if (req.body.status === undefined) {
      const post_body = postBodyCreate(req.body);
      const resp = await sslcommerz
        .init_transaction(post_body)
        .then((response) => {
          return response;
        })
        .catch((error) => {
          return error;
        });
      const order_id = new ObjectID(req.body.tran_id);
      await db.collection("Orders").findOneAndUpdate(
        {
          _id: order_id,
        },
        { $set: { payLink: resp.GatewayPageURL } }
      );
      const orders = [
        {
          orderId: req.body.id,
          items: req.body.cart,
          total: req.body.total,
        },
      ];
      sendMail(
        req.body.name,
        req.body.email,
        orders,
        "INITIATE",
        resp.GatewayPageURL
      );
      res.json(resp);
    } else {
      const order_id = new ObjectID(req.body.tran_id);
      const order = await db
        .collection("orders")
        .find({ _id: order_id })
        .project({
          _id: 0,
          orderId: 1,
          name: 1,
          email: 1,
          items: 1,
          totalSum: 1,
        })
        .toArray();
      const risk_level =
        req.body.risk_level === undefined ? -1 : Number(req.body.risk_level);
      const risk_title =
        req.body.risk_title === undefined ? "" : req.body.risk_title;
      await db.collection("Orders").findOneAndUpdate(
        {
          _id: order_id,
        },
        {
          $set: {
            payStatus: req.body.status,
            riskLevel: risk_level,
            riskTitle: risk_title,
          },
        }
      );
      const orders = [
        {
          orderId: order[0].orderId,
          items: order[0].items,
          total: order[0].totalSum,
        },
      ];
      if (req.body.status === "VALID") {
        if (req.body.risk_level === "0") {
          sendMail(order[0].name, order[0].email, orders, "VALID_SAFE", "");
        } else {
          sendMail(order[0].name, order[0].email, orders, "VALID_UNSAFE", "");
        }
      } else {
        sendMail(order[0].name, order[0].email, orders, req.body.status, "");
      }
      res.json({ message: "success" });
    }
  } else {
    if (req.cookies.transKey === undefined) {
      res.json({ message: "invalidGet" });
    } else {
      const resp = await sslcommerz.transaction_status_session(
        req.cookies.transKey
      );
      res.json(resp);
    }
  }
};
