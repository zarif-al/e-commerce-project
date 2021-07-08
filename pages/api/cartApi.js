import { connectToDatabase } from "../../utils/mongodb";
import { verify, sign } from "jsonwebtoken";
import { ObjectID } from "mongodb";
import { getSession } from "next-auth/client";
import cookie from "cookie";
export default async (req, res) => {
  //Check the clear action in Post
  const { SECRET } = process.env;
  const { db } = await connectToDatabase();
  if (req.method === "POST") {
    const session = await getSession({ req });
    if (req.body.action === "addOne") {
      if (session) {
        //AddOne InSession
        return new Promise(async (resolve, reject) => {
          const user = await db
            .collection("users")
            .find({ email: session.user.email })
            .project({ _id: 1, cart: 1 })
            .toArray();
          var found = user[0].cart.find(({ id }) => id === req.body.id);
          if (found === undefined) {
            //AddOne InSession New Item
            const query = { email: session.user.email };
            const updateDocument = {
              $push: {
                cart: {
                  id: req.body.id,
                  image: req.body.image,
                  name: req.body.name,
                  quantity: 1,
                  price: req.body.price,
                },
              },
            };
            const result = await db
              .collection("users")
              .updateOne(query, updateDocument);
            if (result.modifiedCount === 1) {
              res.json({ message: "success" });
            } else {
              res.json({ message: "fail" });
            }
          } else {
            //AddOne InSession Existing Item
            const query = { email: session.user.email, "cart.id": req.body.id };
            const updateDocument = {
              $set: { "cart.$.quantity": found.quantity + 1 },
            };
            const result = await db
              .collection("users")
              .updateOne(query, updateDocument, {
                returnOriginal: false,
              });
            if (result.modifiedCount === 1) {
              res.json({ message: "success" });
            } else {
              res.json({ message: "fail" });
            }
          }
          resolve();
        });
      } else {
        //AddOne !InSession
        return new Promise((resolve, reject) => {
          verify(req.cookies.tempAuth, SECRET, async function (err, decoded) {
            if (!err && decoded) {
              const ob_id = new ObjectID(decoded.sub);
              const user = await db
                .collection("tempUser")
                .find({ _id: ob_id })
                .project({ _id: 1, cart: 1 })
                .toArray();
              var found = user[0].cart.find(({ id }) => id === req.body.id);
              if (found === undefined) {
                //AddOne !InSession New Item
                const query = { _id: ob_id };
                const updateDocument = {
                  $push: {
                    cart: {
                      id: req.body.id,
                      image: req.body.image,
                      name: req.body.name,
                      quantity: 1,
                      price: req.body.price,
                    },
                  },
                };
                const result = await db
                  .collection("tempUser")
                  .updateOne(query, updateDocument);
                if (result.modifiedCount === 1) {
                  res.json({ message: "success" });
                } else {
                  res.json({ message: "fail" });
                }
                /*  res.json({ message: "success" }); */
              } else {
                //AddOne !InSession Existing Item
                const query = { _id: ob_id, "cart.id": req.body.id };
                const updateDocument = {
                  $set: { "cart.$.quantity": found.quantity + 1 },
                };
                const result = await db
                  .collection("tempUser")
                  .updateOne(query, updateDocument);
                if (result.modifiedCount === 1) {
                  res.json({ message: "success" });
                } else {
                  res.json({ message: "fail" });
                }
              }
              resolve();
            } else {
              res.json({ message: "failed" });
            }
          });
        });
      }
    } else if (req.body.action === "addMultiple") {
      if (session) {
        //AddMultiple InSession
        return new Promise(async (resolve, reject) => {
          const query = { email: session.user.email, "cart.id": req.body.id };
          const updateDocument = {
            $set: { "cart.$.quantity": req.body.quantity },
          };
          const result = await db
            .collection("users")
            .updateOne(query, updateDocument);
          if (result.modifiedCount === 1) {
            res.json({ message: "success" });
          } else {
            res.json({ message: "fail" });
          }
          resolve();
        });
      } else {
        return new Promise((resolve, reject) => {
          verify(req.cookies.tempAuth, SECRET, async function (err, decoded) {
            if (!err && decoded) {
              //AddMultiple !InSession
              const temp_id = new ObjectID(decoded.sub);
              const query = { _id: temp_id, "cart.id": req.body.id };
              const updateDocument = {
                $set: { "cart.$.quantity": req.body.quantity },
              };
              const result = await db
                .collection("tempUser")
                .updateOne(query, updateDocument);
              if (result.modifiedCount === 1) {
                res.json({ message: "success" });
              } else {
                res.json({ message: "fail" });
              }
              resolve();
            }
          });
        });
      }
    } else if (req.body.action === "removeOne") {
      if (session) {
        //removeOne InSession
        return new Promise(async (resolve, reject) => {
          const user = await db
            .collection("users")
            .find({ email: session.user.email })
            .project({ _id: 1, cart: 1 })
            .toArray();
          var found = user[0].cart.find(({ id }) => id === req.body.id);
          if (found === undefined) {
            res.json({ message: "Item doesn't exist." });
          } else {
            const query = { email: session.user.email, "cart.id": req.body.id };
            const updateDocument = {
              $set: { "cart.$.quantity": found.quantity - 1 },
            };
            const result = await db
              .collection("users")
              .updateOne(query, updateDocument);
            if (result.modifiedCount === 1) {
              res.json({ message: "success" });
            } else {
              res.json({ message: "fail" });
            }
          }
          resolve();
        });
      } else {
        //removeOne !InSession
        return new Promise((resolve, reject) => {
          verify(req.cookies.tempAuth, SECRET, async function (err, decoded) {
            if (!err && decoded) {
              const ob_id = new ObjectID(decoded.sub);
              const user = await db
                .collection("tempUser")
                .find({ _id: ob_id })
                .project({ _id: 1, cart: 1 })
                .toArray();
              var found = user[0].cart.find(({ id }) => id === req.body.id);
              if (found === undefined) {
                res.json({ message: "Item doesn't exist." });
              } else {
                const query = { _id: ob_id, "cart.id": req.body.id };
                const updateDocument = {
                  $set: { "cart.$.quantity": found.quantity - 1 },
                };
                const result = await db
                  .collection("tempUser")
                  .updateOne(query, updateDocument);
                if (result.modifiedCount === 1) {
                  res.json({ message: "success" });
                } else {
                  res.json({ message: "fail" });
                }
              }
              resolve();
            }
          });
        });
      }
    } else if (req.body.action === "delete") {
      if (session) {
        //delete InSession
        return new Promise(async (resolve, reject) => {
          const query = { email: session.user.email };
          const updateDocument = {
            $pull: { cart: { id: req.body.id } },
          };
          const result = await db
            .collection("users")
            .updateOne(query, updateDocument);
          if (result.modifiedCount === 1) {
            res.json({ message: "success" });
          } else {
            res.json({ message: "fail" });
          }
          resolve();
        });
      } else {
        //delete !InSession
        return new Promise((resolve, reject) => {
          verify(req.cookies.tempAuth, SECRET, async function (err, decoded) {
            if (!err && decoded) {
              const temp_id = new ObjectID(decoded.sub);
              const query = { _id: temp_id };
              const updateDocument = {
                $pull: { cart: { id: req.body.id } },
              };
              const result = await db
                .collection("tempUser")
                .updateOne(query, updateDocument);
              if (result.modifiedCount === 1) {
                res.json({ message: "success" });
              } else {
                res.json({ message: "fail" });
              }
              resolve();
            }
          });
        });
      }
    } else if (req.body.action === "clear") {
      if (session) {
        return new Promise(async (resolve, reject) => {
          await db.collection("users").findOneAndUpdate(
            {
              email: session.user.email,
            },
            { $set: { cart: [] } }
          );
          res.json({ message: "success" });
          resolve();
        });
      } else {
        return new Promise((resolve, reject) => {
          verify(req.cookies.tempAuth, SECRET, async function (err, decoded) {
            if (!err && decoded) {
              const temp_id = new ObjectID(decoded.sub);
              await db.collection("tempUser").findOneAndUpdate(
                {
                  _id: temp_id,
                },
                { $set: { cart: [] } }
              );
              res.json({ message: "success" });
              resolve();
            }
          });
        });
      }
    }
  } else {
    const session = await getSession({ req });
    if (session) {
      return new Promise(async (resolve, reject) => {
        let cart = await db
          .collection("users")
          .find({ email: session.user.email })
          .project({ _id: 0, cart: 1 })
          .toArray();
        if (cart[0].cart === undefined) {
          cart = await db
            .collection("users")
            .findOneAndUpdate(
              { email: session.user.email },
              { $set: { cart: [] } },
              { returnDocument: "after" }
            );
          res.status(200);
          res.json({ message: "ok", cart: cart.value.cart });
          resolve();
        } else {
          res.status(200);
          res.json({ message: "ok", cart: cart[0].cart });
          resolve();
        }
        resolve();
      });
    } else {
      return new Promise(async (resolve, reject) => {
        //check for tempAuth token
        verify(req.cookies.tempAuth, SECRET, async function (err, decoded) {
          if (!err && decoded) {
            const temp_id = new ObjectID(decoded.sub);
            const user = await db
              .collection("tempUser")
              .find({ _id: temp_id })
              .project({ _id: 1, cart: 1 })
              .toArray();
            res.json({ message: "ok", cart: user[0].cart });
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
                  res.json({
                    message: "ok",
                    cart: resp.ops[0].cart,
                  });
                  resolve();
                }
              }
            );
          }
        });
      });
    }
  }
};
