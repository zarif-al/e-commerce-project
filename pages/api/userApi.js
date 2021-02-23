import { connectToDatabase } from "../../utils/mongodb";
import { verify, sign } from "jsonwebtoken";
import cookie from "cookie";
import { ObjectID } from "mongodb";
export default async (req, res) => {
  const { SECRET } = process.env;
  if (req.method === "GET") {
    const { db } = await connectToDatabase();
    return new Promise((resolve, reject) => {
      ///check for login Auth token
      verify(req.cookies.auth, SECRET, async function (err, decoded) {
        if (!err && decoded) {
          const user_id = new ObjectID(decoded.sub);
          const user = await db
            .collection("Users")
            .find({ _id: user_id })
            .project({
              _id: 1,
              cart: 1,
              name: 1,
              email: 1,
              city: 1,
              address: 1,
              phoneNumber: 1,
            })
            .toArray();
          res.json({ message: "authUser", data: user });
          resolve();
        } else {
          //check for tempAuth token
          verify(req.cookies.tempAuth, SECRET, async function (err, decoded) {
            if (!err && decoded) {
              const temp_id = new ObjectID(decoded.sub);
              const user = await db
                .collection("tempUser")
                .find({ _id: temp_id })
                .project({ _id: 1, cart: 1 })
                .toArray();
              res.json({ message: "unAuthUser", data: user });
              resolve();
            } else {
              //create a tempUser and temptoken
              await db.collection("tempUser").insertOne(
                {
                  createdAt: new Date(),
                  cart: [],
                },
                function (err, resp) {
                  if (err) {
                    res.json({ message: "Error" });
                    resolve();
                  } else {
                    const claims = { sub: resp.insertedId };
                    const jwt = sign(claims, SECRET, { expiresIn: "2h" });
                    res.setHeader(
                      "Set-Cookie",
                      cookie.serialize("tempAuth", jwt, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV !== "development",
                        sameSite: "strict",
                        maxAge: 7200,
                        path: "/",
                      })
                    );
                    res.json({ message: "unAuthUser", data: resp.ops });
                    resolve();
                  }
                }
              );
            }
          });
        }
      });
    });
  }
};
