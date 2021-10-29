const express = require('express');
const ObjectId = require('mongodb').ObjectId;
var cors = require('cors')

const app = express();
app.use(cors());
app.use(express.json())
const port = 5000;

//user:dbuser1
//password:UXpzWDDxsLa40UHX



const {MongoClient} = require('mongodb');
const uri = "mongodb+srv://dbuser1:n5sKe0kjadXjDEeO@cluster0.in8lp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});


async function run() {
    try {
        await client.connect();
        const database = client.db("productsDB");
        const productsCollection = database.collection("products");

        //GET api
        app.get("/products", async (req, res) => {
            const cursor = productsCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        })

        //GET api single products
        app.get('/update/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const result = await productsCollection.findOne(query);
            res.json(result);
        })

        //DELETE api
        app.delete('/update/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const result = await productsCollection.deleteOne(query);
            console.log(result);
            res.json(result);
        })

        //POST api
        app.post("/products", async (req, res) => {
            const products = req.body;
            console.log('products received', products);
            const result = await productsCollection.insertOne(products);
            console.log(result);
            res.json(result);
        })

        //PUT api
        app.put('/update/:id', async (req, res) => {
            const id = req.params.id;
            const updatedProduct = req.body;
            const query = {_id: ObjectId(id)}
            const upadateDoc = {
                $set: {
                    name: updatedProduct.name,
                    price: updatedProduct.price,
                    quantity: updatedProduct.quantity,
                }
            };
            const result = await productsCollection.updateOne(query, upadateDoc);
            res.json(result);
            console.log(result);

        })

    } finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('hello-world');
})
app.listen((port), () => {
    console.log('listening on port');
});