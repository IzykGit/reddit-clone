import 'dotenv/config'

import express from 'express'
import bodyParser from 'body-parser'

import cors from 'cors';

const app = express();
app.use(express());
app.use(bodyParser.json())
app.use(cors());

import mongoose from 'mongoose';
import { MongoClient } from 'mongodb';


import Post from './models/postmodel.js';


app.get("/home", async (req, res) => {
    const client = new MongoClient(process.env.MONGODB_URI!)


    try {
        await client.connect();

        const db = client.db('SocialApp')
        const data = await db.collection('User1').find({}).toArray();

        console.log(data)
        res.json(data)
    }
    catch (err) {
        console.error("Error connecting to database", err)
    }
    finally {
        await client.close()
    }
});

app.post("/post", async (req, res) => {
    const client = new MongoClient(process.env.MONGODB_URI!)

    try {
        await client.connect();
        const db = client.db('SocialApp');
        const newPost = new Post(req.body);
        await db.collection('posts').insertOne(newPost)

        res.status(201).json(newPost);
    }
    catch (err) {
        console.error("Post failed:", err)
        res.status(500).json({ message: `Post Failed: ${err}`})
    }
    finally {
        await client.close()
    }
})

// app.put('/api/posts/:userId/upvote', (req, res) => {
//     const { userId } = req.params;
//     const post = postInfo.find(a => a.userId === userId)
//     if(post) {
//         post.upvotes += 1;
//         res.send(`The article now has ${post.upvotes}`)
//     }
//     else {
//         res.send("That post does not exist")
//     }

// })


// app.post('/api/posts/:userId/comment', (req, res) => {

//     const { userId } = req.params
//     const { username, text } = req.body;

//     const post = postInfo.find(a => a.userId === userId);

//     if (post) {
//         post?.comments.push({ username, text });
//         res.send(post.comments)
//     }
//     else {
//         res.send("That post does not exist")
//     }
// })


mongoose.connect(process.env.MONGODB_URI!, {
    dbName: "SocialApp"
}).then(() => {
    app.listen(5000, () => {
        console.log("Connected on port 5000")
    })
}).catch(error => {
    console.log(error)
})
