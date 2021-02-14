import { connectToDatabase } from "../../utils/mongodb";
import { compare } from "bcrypt";
import { sign, verify } from "jsonwebtoken";
import cookie from "cookie";
import { ObjectID } from "mongodb";

export default async (req, res) => {
  const { SECRET } = process.env;
  const { db } = await connectToDatabase();
  if (req.method === "POST") {
    const { SECRET } = process.env;
    const user = await db
      .collection("Users")
      .find({
        email: req.body.email,
      })
      .project({ password: 1, name: 1, cart: 1, loginStatus: 1 })
      .toArray();
    if (user.length === 1) {
      if (user[0].loginStatus === 0) {
        return new Promise((resolve, reject) => {
          try {
            compare(
              req.body.password,
              user[0].password,
              function (err, result) {
                if (!err && result) {
                  res.statusCode = 200;
                  const claims = { sub: user[0]._id };
                  const jwt = sign(claims, SECRET, { expiresIn: "1h" });
                  res.setHeader(
                    "Set-Cookie",
                    cookie.serialize("auth", jwt, {
                      httpOnly: true,
                      secure: process.env.NODE_ENV !== "development",
                      sameSite: "strict",
                      maxAge: 3600,
                      path: "/",
                    })
                  );
                  res.json({ message: "Success" });
                  resolve();
                } else if (!err && !result) {
                  res.statusCode = 600;
                  res.setHeader("Content-Type", "application/json");
                  res.end(JSON.stringify({ response: "Failed" }));
                  resolve();
                } else {
                  res.statusCode = 601;
                  res.setHeader("Content-Type", "application/json");
                  res.end(JSON.stringify({ response: err }));
                  resolve();
                }
              }
            );
          } catch (e) {
            res.json(e);
            res.status(500).end();
            return resolve();
          }
        });
      } else {
        res.statusCode = 700;
        res.setHeader("Content-Type", "application/json");
        res.json({ response: "Already Logged In" });
        res.end();
      }
    } else {
      res.statusCode = 600;
      res.setHeader("Content-Type", "application/json");
      res.json({ response: "No email" });
      res.end();
    }
  } else {
    verify(req.cookies.auth, SECRET, async function (err, decoded) {
      if (!err && decoded) {
        const user_id = new ObjectID(decoded.sub);
        await db.collection("Users").findOneAndUpdate(
          {
            _id: user_id,
          },
          { $set: { loginStatus: 0 } }
        );
      }
    });
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("auth", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: -1,
        path: "/",
      })
    );
    res.end();
  }
};
