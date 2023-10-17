import express from "express";
import cors from'cors';
import 'dotenv/config';
const app = express();
const port = process.env.PORT || 5000
import { MongoClient, ServerApiVersion,ObjectId } from 'mongodb';
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kzarlhv.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });


app.use(cors());
app.use(express.json())

app.get('/',(req,res)=>{
    res.send('server connected')
})


// Create a MongoClient with a MongoClientOptions object to set the Stable API version

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const coffeeCollection = client.db('coffeeEmporiumDB').collection('coffees')

    //route for post
    app.post('/coffee',async(req,res)=>{
        const coffee = req.body;
        console.log('hitted')
        const result = await coffeeCollection.insertOne(coffee);
        res.send(result);
    })

    app.get('/coffee',async(req,res)=>{
        const query = coffeeCollection.find();
        const result = await query.toArray();
        res.send(result);
    })

    app.delete('/coffee/:id',async(req,res)=>{
        const id = req.params.id;
        const query = {_id:new ObjectId(id)}
        const result = await coffeeCollection.deleteOne(query);
        res.send(result);
    })

    app.get('/coffee/:id',async(req,res)=>{
        const id = req.params.id;
        const query = {_id : new ObjectId(id)}
        const result = await coffeeCollection.findOne(query);
        res.send(result);
    })

    app.put('/coffee/:id',async(req,res)=>{
        const id = req.params.id;
        const coffee = req.body;
        const cursor = { _id: new ObjectId(id) };
        const options = { upsert : true};
        const updateCoffee = {
                        $set :{
                            name: coffee.name,
                            chef: coffee.chef,
                        supplier: coffee.supplier,
                            taste: coffee.taste,
                        category: coffee.category,
                            price: coffee.price,
                            image: coffee.image,
                        }
        }
        const result = await coffeeCollection.updateOne(cursor,updateCoffee,options);
        res.send(result);
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port,()=>{
    console.log('form port:',port)
})