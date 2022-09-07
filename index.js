const express = require("express");
const app = express();
const port = 4000;
var cors = require("cors");
const { MongoClient } = require("mongodb");
require("dotenv").config();

//To deploy this project:
//Create a free tier MongoDB cluster on MongoDB Atlas
// Replace the uri string with your cluster connection string(or replace URI in an env file)
//create a database called "Post" and a collection called "posts"
const uri = process.env.URI;

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/posts", async (req, res) => {
  const client = new MongoClient(uri);
  async function run() {
    try {
      const database = client.db("Post");
      const postsCollection = database.collection("posts");

      const allPosts = await postsCollection.find({}).toArray();
      res.status(200).send(allPosts);
    } catch (error) {
      console.log(error);
    } finally {
      await client.close();
    }
  }
  run().catch(console.dir);
});

app.post("/submitPost", (req, res) => {
  const client = new MongoClient(uri);
  async function run() {
    try {
      const aNewPost = { ...req.query };
      const { title, body } = aNewPost;
      console.log({
        location: "submitPost",
        info: `Got request ${JSON.stringify(req.query)}`,
      });
      const database = client.db("Post");
      const postsCollection = database.collection("posts");

      const query = { title: title, body: body, dt: new Date() };
      console.log(query);

      const response = await postsCollection.insertOne(query);
      res.status(200).send(response);
      console.log(response);
    } finally {
      await client.close();
    }
  }
  run().catch(console.dir);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
