import { connectToDatabase } from "../../utils/mongodb";
import { hash } from "bcrypt";
import cookie from "cookie";
import { sign } from "jsonwebtoken";
import { ObjectID } from "mongodb";
export default async (req, res) => {
  const { db } = await connectToDatabase();
  const { SECRET } = process.env;
  if (req.method === "POST") {
    return new Promise((resolve, reject) => {
      try {
        hash(req.body.password, 10, async function (err, hash) {
          await db.collection("Users").insertOne(
            {
              name: req.body.name,
              email: req.body.email,
              password: hash,
              city: req.body.city,
              address: req.body.address,
              phoneNumber: req.body.phoneNumber,
              cart: [],
            },
            async function (error, response) {
              if (error) {
                res.statusCode = 600;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ response: error }));
                resolve();
              } else {
                const user_id = new ObjectID(response.insertedId);
                await db.collection("LoginTable").insertOne({
                  _id: user_id,
                  loginTime: new Date(),
                });
                res.statusCode = 200;
                const claims = { sub: response.insertedId };
                const jwt = sign(claims, SECRET, { expiresIn: "2h" });
                res.setHeader(
                  "Set-Cookie",
                  cookie.serialize("auth", jwt, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV !== "development",
                    sameSite: "strict",
                    maxAge: 7200,
                    path: "/",
                  })
                );
                res.json("Success");
                resolve();
              }
            }
          );
        });
      } catch (e) {
        res.json(error);
        res.status(500).end();
        return resolve();
      }
    });
  }
};
