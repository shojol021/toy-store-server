const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.port || 3000
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6c8obk5.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        //  await client.connect();

        const toysCollection = client.db('ToyDB').collection('toys')

        app.get('/toys', async (req, res) => {
            console.log(req.query.sellerEmail)
            console.log(req.body)
            let query = {}
            if (req.query.sellerEmail) {
                query = { sellerEmail: req.query.sellerEmail }
                const result = await toysCollection.find(query).toArray()
                res.send(result)
            }
            else{
                query = { search: req.query.search}
            }

        })

        app.get('/toys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await toysCollection.findOne(query)
            res.send(result)
        })

        app.post('/toys', async (req, res) => {
            const toyDetails = req.body;
            console.log(toyDetails)
            const result = await toysCollection.insertOne(toyDetails)
            res.send(result)
        })

        app.put('/toys/:id', async (req, res) => {
            const id = req.params.id;
            const updatedDetails = req.body;
            console.log(updatedDetails)
            const filter = { _id: new ObjectId(id) }
            const updatedDoc = {
                $set: {
                    price: updatedDetails.price,
                    availableQuantity: updatedDetails.availableQuantity,
                    shortDescription: updatedDetails.shortDescription
                }
            }
            const result = await toysCollection.updateOne(filter, updatedDoc)
            res.send(result)
        })

        app.delete('/delete/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await toysCollection.deleteOne(query)
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }
    finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Server is running')
})

app.listen(port, () => { console.log('running on port', port) })