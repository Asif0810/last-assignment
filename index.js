const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = 5000
const cors = require('cors');
require('dotenv').config();
// middleware
app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.h9wahhk.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {

    // const buttonPhoneCollection = client.db('last_assignment').collection('btn_phones');
    // const androidPhoneCollection = client.db('last_assignment').collection('android_phones');
    const allPhoneCollection = client.db('last_assignment').collection('all_phones');
    const bookedPhoneCollection = client.db('last_assignment').collection('booked_data');
    const userCollection = client.db('last_assignment').collection('users_data');
    const PhonCategoriesCollection = client.db('last_assignment').collection('phone_categories');

    try {

        app.get('/phone-categories', async (req, res) => {
            const query = {};
            const result = await PhonCategoriesCollection.find(query).toArray();
            res.send(result)
        })

        app.get('/all-phones', async (req, res) => {
            const phonescategory = req.query.category
            const query = { category: phonescategory }
            const result = await allPhoneCollection.find(query).toArray();
            res.send(result)
        })
        app.post('/all-phones', async (req, res) => {
            const phone = req.body;
            const result = await allPhoneCollection.insertOne(phone);
            res.send(result)
        })

        app.get('/uploaded-products', async (req, res) => {
            const email = req.query.email;
            const query = { seller_email: email };
            const result = await allPhoneCollection.find(query).toArray();
            res.send(result)
        })
        // app.get('/iphones', async (req, res) => {
        //     const query = {};
        //     const result = await iphonesCollection.find(query).toArray();
        //     res.send(result)
        // })
        // phone booking api
        app.post('/booking-phone', async (req, res) => {
            const booking = req.body;
            const result = await bookedPhoneCollection.insertOne(booking)
            res.send(result)
        })
        app.get('/jwt', async (req, res) => {
            const email = req.query.email;
            const query = { email };
            const result = await userCollection.findOne()
            if (result) {
                const token = 
            }
        })
        // users data collection
        app.post('/user', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.send(result)
        })

    }
    finally {

    }
}
run().catch(console.error())


app.get('/', (req, res) => {
    res.send('mobile hat!')
})

app.listen(port, () => {
    console.log(`mobile hat start on ${port}`)
})
