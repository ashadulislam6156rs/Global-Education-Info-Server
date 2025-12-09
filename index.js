require("dotenv").config();
const express = require("express");
const cors = require("cors");

//------> app <------\\
const app = express();

//------> Server Port <------\\
const port = process.env.PORT || 5000;

//------> middleWare <------\\
app.use(express.json());
app.use(cors());

//------> Root api <------\\
app.get("/", (req, res) => {
  res.send("Global Education Info Server is Running.....");
});

//------> Database <------\\
const { MongoClient, ServerApiVersion} = require("mongodb");

const uri = `${process.env.DB_URL}`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});


async function run() {
  try {
    await client.connect();

    const db = client.db("globalEducationInfo_DB");
    const countriesCollection = db.collection("countries");

      // Countries Related api's

      app.post("/countries", async (req, res) => {
          const newCountry = req.body;
         const result = await countriesCollection.insertOne(newCountry);
         res.send(result);
       });
      
      app.get("/countries", async (req, res) => {
          const result = await countriesCollection.find().toArray();
          res.send(result);
      });





    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

//------> app listener <------\\
app.listen(port, () => {
  console.log(`Global Education Info Server is Running Port: ${port}`);
});
