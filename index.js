const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = 5000
const cors = require('cors');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { query } = require('express');
// middleware
app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.h9wahhk.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

function verifyjwt(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ message: 'unauthorized' })
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: 'forbidden' })
        }
        req.decoded = decoded
        next()
    })
}

async function run() {
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
            const email = phone.seller_email;
            const query = { email: email }
            console.log(email)
            const verify = await userCollection.findOne(query)
            const userCategory = verify.user_category
            
            if (userCategory !== 'seller') {
                return res.send({ message: 'you are not seller please create a buyer account' })
            }
            const result = await allPhoneCollection.insertOne(phone);
            return res.send(result)
        }
        )

        app.get('/uploaded-products', async (req, res) => {
            const email = req.query.email;
            const query = { seller_email: email };
            const result = await allPhoneCollection.find(query).toArray();
            res.send(result)
        })

        app.post('/booking-phone', async (req, res) => {
            const booking = req.body;
            const result = await bookedPhoneCollection.insertOne(booking)
            res.send(result)
        })

        app.get('/jwt', async (req, res) => {
            const email = req.query.email;
            const query = { email };
            const result = await userCollection.findOne(query)
            if (result) {
                const token = jwt.sign({ email }, process.env.JWT_ACCESS_TOEKN)
                return res.send({ accessToken: token })
            }
            res.status(403).send({ accessToken: '' })
        })
        // users data collection
        app.post('/user', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            console.log(result)
            res.send(result)
        })
        app.get('/user', async (req, res) => {
            const query = {};
            const result = await userCollection.find(query).toArray();
            res.send(result)
        })
        // my order
        app.get('/order', async (req, res) => {
            const email = req.query.email;
            const query = { email }
            const result = await bookedPhoneCollection.find(query).toArray();
            res.send(result)
        })
        // delete operation
        app.delete('/delete-user/:id', async (req, res) => {
            const id = req.params.id;
            const email = req.headers.email;
            const ehcking = { email: email }
            const query = await userCollection.findOne(ehcking)
           
            if (query.role !== 'admin') {
                return res.send({ message: 'you are not admin do not try to delete' })
            }
            const filter = { _id: ObjectId(id) }
            const result = await userCollection.deleteOne(filter)
            res.send(result)
        })
        // admmin power
        app.get('/admin-power', async (req, res) => {
            const email = req.query.email;
            const filter = { email: email };
            const checkAdmin = await userCollection.findOne(filter)
            if (checkAdmin.role !== 'admin') {
                return res.send({ isadmin: false })
            }
            res.send({ isadmin: true })
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
