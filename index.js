const express = require('express')
require('dotenv').config();
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;



const app = express()
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.srriw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

console.log(uri)

async function run() {
  try {
    await client.connect();
    const database = client.db("dynamic_form");
    const formInfoCollection = database.collection("formInfo");
    const finalFormInfoCollection = database.collection("finalFormInfo");

    app.post('/formInfo', async(req, res) =>{
      const formInfo = req.body;
      const result = await formInfoCollection.insertOne(formInfo);
      
      res.json(result);
    })
    app.post('/finalforminfo', async(req, res) =>{
      const finalformInfo = req.body;
      const result = await finalFormInfoCollection.insertOne(finalformInfo);
      console.log(result)
      res.json(result);
    })

    app.get('/finalformInfo', async (req, res) => {
      const cursor = finalFormInfoCollection.find({});
      const info = await cursor.toArray();
      res.send(info);
  } )  
    app.get('/formInfo', async (req, res) => {
      const cursor = formInfoCollection.find({});
      const info = await cursor.toArray();
      res.send(info);
  } )  

    app.get('/formInfo/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const singleform = await formInfoCollection.findOne(query);
      res.json(singleform)
      
  } )  
  }
    // create a document to insert
    finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('server running')
})

app.listen(port, () => {
  console.log(`listening on port ${port}`)
})