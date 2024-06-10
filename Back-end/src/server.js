

import express from 'express'
import bodyParser from 'body-parser'

import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import multer from 'multer';
import stream from 'stream';

import cors from 'cors';

import 'dotenv/config'

const app = express();
app.use(express());
app.use(bodyParser.json())
app.use(cors());

import mongoose, { Types } from 'mongoose';
import { MongoClient, ObjectId } from 'mongodb';


import Post from './models/postmodel.js';

// AWS Credentials
const s3Client = new S3Client({
    region: 'us-east-1',
    credentials: {
      accessKeyId: process.env.ACCESS_KEY,
      secretAccessKey: process.env.SECRET_KEY,
    },
    endpoint: 'https://us-east-1.linodeobjects.com',
  });


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });















// fetching all posts from database
app.get("/home", async (req, res) => {
    const client = new MongoClient(process.env.MONGODB_URI)


    try {
        await client.connect();

        const db = client.db('SocialApp')
        const data = await db.collection('posts').find({}).toArray();

        
        res.json(data)
    }
    catch (err) {
        console.error("Error connecting to database", err)
    }
    finally {
        await client.close()
    }
});

// fetching post images

app.get("/home/:imageId", async (req, res) => {
    const imageId = req.params.imageId

    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: imageId,
    };

    try {
        const data = await s3Client.send(new GetObjectCommand(params));
        if (data.Body) {
          const chunks = [];
          data.Body.on('data', (chunk) => chunks.push(chunk));
          data.Body.on('end', () => {
            const buffer = Buffer.concat(chunks);
            const base64 = buffer.toString('base64');
            res.json({ image: base64 });
          });
        } else {
          res.status(404).json({ message: 'Image not found' });
        }
      } catch (error) {
        console.error('S3 fetch error:', error);
        res.status(500).json({ message: error.message });
      }
})


//fetching specific post form database

app.get("/post/:id", async (req, res) => {
    const client = new MongoClient(process.env.MONGODB_URI)

    const postId = new Types.ObjectId(req.params.id);

    try {
        await client.connect();

        const db = client.db("SocialApp");
        const post = await db.collection('posts').findOne({ _id: postId })
        console.log(post)
        res.json(post)
    }
    catch (error) {
        console.error("Error retrieving post:", error)
        res.status(404).json({ message: "Error"})
    }
})




// post creation page
app.post("/post", upload.single('file'), async (req, res) => {
    const client = new MongoClient(process.env.MONGODB_URI);
    


    try {
        // handling post to s3
        if (req.file) {
        
        const params = {
          Bucket: process.env.BUCKET_NAME,

          // setting key to random generated image Id
          Key: req.body.imageId,
          Body: req.file.buffer,
          ContentType: req.file.mimetype,
        };
  
        console.log('Uploading to S3 with params:', params);
        
        try {

            // post image is sent to s3 bucket
            await s3Client.send(new PutObjectCommand(params));
        } catch (error) {
          console.error('S3 upload error:', error);
        }
        } else {
            console.log('No file found in the request');
        }

        const newPostData = {
            ...req.body,
            imageId: req.body.imageId, // save the generated image ID in the post data
        };
        

        // handling post to mongodb
        await client.connect();
        const db = client.db('SocialApp');
        const newPost = new Post(newPostData);
        await db.collection('posts').insertOne(newPost);
  
        res.status(201).json(newPost);
    }
    catch (err) {
      console.error('Post creation failed:', err);
      res.status(500).json({ message: `Post Failed: ${err}` });
    }
    finally {
      await client.close();
    }
  });











// app.get('/:postId/liked', async (req, res) => {
//     const client = new MongoClient(process.env.MONGODB_URI)
//     const postId = req.params.postId;

//     try {
//         await client.connect()
//         const db = client.db('SocialApp');
        
//         const post = await db.collection('posts').findOne({ _id: new ObjectId(postId)})

//         res.json(post.likes)
//     }
//     catch (error) {
//         console.log(error)
//     }
//     finally {
//         await client.close();
//     }
// })



app.put('/:postId/like', async (req, res) => {
    const client = new MongoClient(process.env.MONGODB_URI)
    const postId = req.params.postId;
    
    console.log("attempting to like")
    try {
        console.log("in try")
        await client.connect()
        const db = client.db('SocialApp');

        await db.collection("posts").updateOne(
            {_id: new ObjectId(postId) },
            { $inc: {likes: 1 }}
        )
        const post = await db.collection('socialapp').findOne({ _id: new ObjectId(postId) })

        if(post) {
            console.log("like made")
            res.json(post)
        }
    }
    catch (error) {
        console.log("like failed")
        console.error(error.message)
    } 

})

app.put('/:postId/unlike', async (req, res) => {
    const client = new MongoClient(process.env.MONGODB_URI)
    const postId = req.params.postId;
    
    console.log("attempting to unlike")
    try {
        console.log("in try")
        await client.connect()
        const db = client.db('SocialApp');

        await db.collection("posts").updateOne(
            {_id: new ObjectId(postId) },
            { $inc: {likes: -1 }}
        )
        const post = await db.collection('socialapp').findOne({ _id: new ObjectId(postId) })

        if(post) {
            console.log("like made")
            res.json(post)
        }
    }
    catch (error) {
        console.log("like failed")
        console.error(error.message)
    } 

})






// fetching new comment after a comment is posted

app.get('/post/:postId/comment', async (req, res) => {
    const client = new MongoClient(process.env.MONGODB_URI)

    const postId = req.params;

    try {
        await client.connect()
        const db = client.db('SocialApp');

        const post = await db.collection('posts').findOne({ _id: postId})

        res.json(post.comments)
    }
    catch (error) {
        res.status(500).json({ message: "Failed to make comment" })
    }
    finally {
        await client.close()
    }
})


// posting a new comment

app.post('/posts/:postId/comment', async (req, res) => {
    const client = new MongoClient(process.env.MONGODB_URI)
    const { postId } = req.params
    const { body, date } = req.body;

    console.log("Attempting to comment")


     try {
        console.log("In try")
        await client.connect()
        const db = client.db('SocialApp')
            
        const post = await db.collection('posts').updateOne({ _id: new ObjectId(postId) }, {
            $push: { comments: { body, date: new Date(date) }} 
        })

        console.log("Comment Made")
        res.json(post)
    }
    catch (error) {
            console.log(error)
            res.status(500).json({ message: "Error:", error })
    } 
    finally {
        await client.close();
    }
})


















app.delete('/post/:id/:imageId', async (req, res) => {
    const client = new MongoClient(process.env.MONGODB_URI)
    const imageId = req.params.imageId
    const postId = new Types.ObjectId(req.params.id);

    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: imageId,
    };

    try {
        await client.connect();
        const db = client.db('SocialApp');

        db.collection("posts").deleteOne({ _id: postId })
        s3Client.send(new DeleteObjectCommand(params))
        console.log("deletion made")
    }
    catch (error) {
        console.error(error)
    }
})


mongoose.connect(process.env.MONGODB_URI, {
    dbName: "SocialApp"
}).then(() => {
    app.listen(5000, () => {
        console.log("Connected on port 5000")
    })
}).catch(error => {
    console.log(error)
})
