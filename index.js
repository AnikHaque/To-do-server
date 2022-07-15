const express = require('express')
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const app = express()
// const stripe = require("stripe")(process.env.STRIPE_SECRET);
const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json()); 

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lx750.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
      await client.connect();
      const database = client.db("recordsystem");
       const recordscollection = database.collection("records");
    
app.get('/records', async(req, res) => {
    const cursor = recordscollection.find({});
    const records = await cursor.toArray();
    res.send(records);
})

app.get('/records/:id', async(req,res)=>{
    const id = req.params.id;
    const query = {_id:ObjectId(id)};
    const result = await recordscollection.findOne(query);
    res.send(result);
})

app.put('/records/:id', async(req,res)=>{
    const id = req.params.id;
    const updated = req.body;
    const filter = {_id:ObjectId(id)};
    const options = {upsert:true};
    const updatedDoc = {
        $set:updated
    }
    const result = await recordscollection.updateOne(filter,updatedDoc,options);
    res.send(result);
})

app.delete('/records/:id', async(req,res) => {
const id = req.params.id;
const query = {_id:ObjectId(id)};
const result = await recordscollection.deleteOne(query);
res.send(result);
})


app.post('/records', async(req, res) => {
    const newtool = req.body; 
    const result = await recordscollection.insertOne(newtool);
    console.log('hitting the post',req.body);
    console.log('added hotel', result)
    res.json(result);
          
  })




    } 
    finally {
      
    }
  }
  run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})