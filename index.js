const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();

// middle-ware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.BD_USER}:${process.env.DB_PASS}@cluster0.w0v9pwr.mongodb.net/?appName=Cluster0`;

// MongoClient
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
    try{
        await client.connect();

        const db = client.db('producthub_db');
        const productsCollection = db.collection('products');

        
        // Get all products
        app.get('/products', async (req, res) => {
            const cursor = productsCollection.find().sort({ date: -1 });
            const result = await cursor.toArray();
            res.send(result);
        });

        // Post api
        app.post('/products', async (req, res) => {
            const data = req.body;
            const result = await productsCollection.insertOne(data);
            res.send(result);
        });

        // Latest products
        app.get('/latest-products', async (req, res) => {
            const result = await productsCollection
                .find()
                .sort({ date: -1 })
                .limit(3)
                .toArray();
            res.send(result);
        });

        // Get single product
        app.get('/products-details/:id', async (req, res) => {
            const id = req.params.id;
            if (!ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid product ID' });

            const product = await productsCollection.findOne({ _id: new ObjectId(id) });
            if (!product) return res.status(404).json({ message: 'Product not found' });

            res.send(product);
        });








        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }
    finally{

    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Server is running!')
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
