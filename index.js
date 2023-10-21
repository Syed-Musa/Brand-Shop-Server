const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// app.use(cors());
// app.use(express.json());
app.use(express.json());
const corsConfig = {
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
};
app.use(cors(corsConfig))


const uri = `mongodb+srv://${process.env.db_USER}:${process.env.db_PASS}@cluster0.jv3edzu.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    

    const brandCollection = client.db('brandDB').collection('brand');
    const userCollection = client.db('brandDB').collection('user');

    app.get('/mycart', async(req, res)=>{
        const cursor = brandCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    });

    app.get('/mycart/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await brandCollection.findOne(query);
      res.send(result);
    })

    app.post('/mycart', async(req, res)=>{
        const newBrand = req.body;
        console.log(newBrand);
        const result = await brandCollection.insertOne(newBrand);
        res.send(result);
    });

    app.put('/mycart/:id', async(req, res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const options = {upsert: true};
      const updatedProduct = req.body;
      const product = {
        $set: {
          name:updatedProduct.name, 
          brandname:updatedProduct.brandname, 
          choose:updatedProduct.choose, 
          price:updatedProduct.price, 
          rating:updatedProduct.rating, 
          description:updatedProduct.description, 
          photo:updatedProduct.photo,
        }
      }

      const result = await brandCollection.updateOne(filter, product, options);
      res.send(result);
    })

    app.delete('/mycart/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await brandCollection.deleteOne(query);
      res.send(result);
    });

    app.get('/user', async(req, res)=>{
      const cursor = userCollection.find();
      const users = await cursor.toArray();
      res.send(users);
    })

    app.post('/user', async(req, res)=>{
      const user = req.body;
      console.log(user);
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    app.patch('/user', async(req, res)=>{
      const user = req.body;
      const filter = {email: user.email};
      const updateDoc = {
        $set: {
          lastLoggedAt: user.lastLoggedAt
        }
      }
      const result = await userCollection.updateOne(filter, updateDoc);
      res.send(result);
    })

    app.delete('/user/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await userCollection.deleteOne(query);
      res.send(result);
    })

    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res)=>{
    res.send('Brand shop server is running')
});

app.listen(port, ()=>{
    console.log(`Brand shop server is running on port: ${port}`)
})