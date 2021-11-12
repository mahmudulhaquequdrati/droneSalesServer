const { MongoClient } = require("mongodb");
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();

// middleware
app.use(cors());
app.use(express.json());

// database
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tkswl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// connect
async function run() {
  try {
    await client.connect();
    const database = client.db("droneSales");
    const productCollection = database.collection("products");
    const reviewCollection = database.collection("reviews");
    const orderCollection = database.collection("orders");
    const userCollection = database.collection("users");

    // create a document to insert

    // post some orders
    app.post("/orders", async (req, res) => {
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.json(result);
    });

    // post some products
    app.post("/products", async (req, res) => {
      const product = req.body;
      const result = await productCollection.insertOne(product);
      res.json(result);
    });

    // post some users to database
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.json(result);
    });

    // update user to database
    app.put("/users", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      res.json(result);
    });

    // get some products
    app.get("/products", async (req, res) => {
      const cursor = productCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });

    // get user order
    app.get("/order", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const cursor = orderCollection.find(query);
      const result = await cursor.toArray();
      res.json(result);
    });

    // get specific product
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productCollection.findOne(query);
      res.json(result);
    });

    // post one review
    app.post("/reviews", async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      res.json(result);
    });

    // get some reviews
    app.get("/reviews", async (req, res) => {
      const cursor = reviewCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });

    //get some orders
    app.get("/orders", async (req, res) => {
      const cursor = orderCollection.find({});
      const result = await cursor.toArray();
      res.json(result);
    });

    // delete one order
    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await orderCollection.deleteOne(query);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Welcome to droneSales!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
