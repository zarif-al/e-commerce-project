import { connectToDatabase } from "../../utils/mongodb";
import { verify } from "jsonwebtoken";
import { ObjectID } from "mongodb";
export default async (req, res) => {
  const { SECRET } = process.env;
  if (req.method === "POST") {
    const { db } = await connectToDatabase();
    if (req.body.action === "addOne") {
      return new Promise((resolve, reject) => {
        verify(req.cookies.auth, SECRET, async function (err, decoded) {
          if (!err && decoded) {
            const user_id = new ObjectID(decoded.sub);
            const user = await db
              .collection("Users")
              .find({ _id: user_id })
              .project({ _id: 1, cart: 1 })
              .toArray();
            var found = user[0].cart.find(({ id }) => id === req.body.id);
            if (found === undefined) {
              const query = { _id: user_id };
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
                .collection("Users")
                .updateOne(query, updateDocument);
              res.json(result);
            } else {
              const query = { _id: user_id, "cart.id": req.body.id };
              const updateDocument = {
                $set: { "cart.$.quantity": found.quantity + 1 },
              };
              const result = await db
                .collection("Users")
                .updateOne(query, updateDocument);
              res.json(result);
            }
            resolve();
          } else {
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
                  res.json(result);
                } else {
                  const query = { _id: ob_id, "cart.id": req.body.id };
                  const updateDocument = {
                    $set: { "cart.$.quantity": found.quantity + 1 },
                  };
                  const result = await db
                    .collection("tempUser")
                    .updateOne(query, updateDocument);
                  res.json(result);
                }
                resolve();
              }
            });
          }
        });
      });
    } else if (req.body.action === "addMultiple") {
      return new Promise((resolve, reject) => {
        verify(req.cookies.auth, SECRET, async function (err, decoded) {
          if (!err && decoded) {
            const user_id = new ObjectID(decoded.sub);
            const user = await db
              .collection("Users")
              .find({ _id: user_id })
              .project({ _id: 0, cart: 1 })
              .toArray();
            const query = { _id: user_id, "cart.id": req.body.id };
            const updateDocument = {
              $set: { "cart.$.quantity": req.body.quantity },
            };
            const result = await db
              .collection("Users")
              .updateOne(query, updateDocument);
            res.json(result);
            resolve();
          } else {
            verify(req.cookies.tempAuth, SECRET, async function (err, decoded) {
              if (!err && decoded) {
                const ob_id = new ObjectID(decoded.sub);
                const query = { _id: ob_id, "cart.id": req.body.id };
                const updateDocument = {
                  $set: { "cart.$.quantity": req.body.quantity },
                };
                const result = await db
                  .collection("tempUser")
                  .updateOne(query, updateDocument);
                res.json(result);
                resolve();
              }
            });
          }
        });
      });
    } else if (req.body.action === "delete") {
      const { db } = await connectToDatabase();
      return new Promise((resolve, reject) => {
        verify(req.cookies.auth, SECRET, async function (err, decoded) {
          if (!err && decoded) {
            const user_id = new ObjectID(decoded.sub);
            const query = { _id: user_id };
            const updateDocument = {
              $pull: { cart: { id: req.body.id } },
            };
            const result = await db
              .collection("Users")
              .updateOne(query, updateDocument);
            res.json(result);
            resolve();
          } else {
            verify(req.cookies.tempAuth, SECRET, async function (err, decoded) {
              if (!err && decoded) {
                const ob_id = new ObjectID(decoded.sub);
                const query = { _id: ob_id };
                const updateDocument = {
                  $pull: { cart: { id: req.body.id } },
                };
                const result = await db
                  .collection("tempUser")
                  .updateOne(query, updateDocument);
                res.json(result);
                resolve();
              }
            });
          }
        });
      });
    }
  }
};
