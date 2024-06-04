import 'dotenv/config'

import express from 'express'
import bodyParser from 'body-parser'

const app = express();
app.use(express());
app.use(bodyParser.json())

import mongoose from 'mongoose';
import { MongoClient } from 'mongodb';



mongoose.connect(process.env.MONGODB_URI!, {
    dbName: "SocialApp"
}).then(() => {
    app.listen(5000, () => {
        console.log("Connected on port 5000")
    })
}).catch(error => {
    console.log(error)
})
