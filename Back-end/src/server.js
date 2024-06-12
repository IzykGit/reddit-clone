

import express from 'express'
import bodyParser from 'body-parser'

import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import multer from 'multer';
import stream from 'stream';

import path from 'path';

import { fileURLToPath } from 'url';

import cors from 'cors';

import 'dotenv/config'

import fs from 'fs';
import admin from 'firebase-admin'

const credentials = JSON.parse(
    fs.readFileSync('./credentials.json')
)

admin.initializeApp({
    credential: admin.credential.cert(credentials)
})



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

const app = express();
app.use(express());
app.use(bodyParser.json())
app.use(cors());

app.use(express.static(path.join(__dirname, "../dist")))

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





app.get(/^(?!\/api).+/, (req, res) => {
    res.sendFile(path.join(__dirname, "../dist/index.html"))
})




// verifying the authtoken
app.use(async (req, res, next) => {
    const token = req.headers.authtoken;

    if(token) {

        try {
            req.user = await admin.auth().verifyIdToken(token)
        }
        catch (e) {
            return res.status(400)
        }
    }
    else {
        req.user = {}
    }


    req.user = req.user || {}
    console.log(req.user)
    next();
})














// // sorting posts by newest first
// const sortedData = response.data.posts.sort((a: Data, b: Data) => new Date(b.date).getTime() - new Date(a.date).getTime());

// fetching all posts from database
app.get("/api/home", async (req, res) => {
    const client = new MongoClient(process.env.MONGODB_URI)


    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const skip = (page - 1) * limit;

        await client.connect();

        const db = client.db('SocialApp')
        const postCollection = db.collection('posts')

        const posts = await postCollection.find({}).sort({ date: -1 })
        .skip(skip).limit(limit).toArray();

        const totalPosts = await postCollection.countDocuments()

        
        res.json({
            posts,
            totalPosts,
            totalPages: Math.ceil(totalPosts / limit),
            currentPage: page
        });
    }
    catch (err) {
        console.error("Error connecting to database", err)
    }
    finally {
        await client.close()
    }
});

// fetching post images

app.get("/api/home/:imageId", async (req, res) => {
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

app.get("/api/post/:id", async (req, res) => {
    const client = new MongoClient(process.env.MONGODB_URI)

    const postId = new Types.ObjectId(req.params.id);

    const { uid } = req.user;
    try {
        await client.connect();

        const db = client.db("SocialApp");
        const post = await db.collection('posts').findOne({ _id: postId })
        console.log(post)

        if(post) {
            const likedIds = post.upvoteIds || [];
            post.canLike = uid && !likedIds.includes(uid)
            res.json(post)
        }

    }
    catch (error) {
        console.error("Error retrieving post:", error)
        res.status(404).json({ message: "Error"})
    }
    finally {
        await client.close()
    }
})




// post creation page
app.post("/api/post", upload.single('file'), async (req, res) => {
    const client = new MongoClient(process.env.MONGODB_URI);
    
    console.log(req.headers.uid)

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
        
        // logging s3 params
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











app.use((req, res, next) => {

    if (req.user) {
        next()
    }
    else {
        response.sendStatus(401)
    }
})

app.put('/api/:postId/like', async (req, res) => {
    // getting mongoclient
    const client = new MongoClient(process.env.MONGODB_URI)

    // getting post id and user id
    const postId = req.params.postId;
    const uid = req.user.uid
    console.log(uid)
    

    console.log("attempting to like")
    try {

        // conecting to client and database
        await client.connect()
        const db = client.db('SocialApp');
        

        // fetching original post
        const post = await db.collection('posts').findOne({ _id: new ObjectId(postId) })

        const likedIds = post.likedIds || [];
        console.log(`Liked IDs: ${likedIds}`)

        const canLike = uid && !likedIds.includes(uid)
        console.log(`Can like: ${likedIds}`)
        // checking if post exists
        if(post) {

            

            // if user can like, update is sent
            if(canLike) {
                console.log("in here")
                await db.collection("posts").updateOne(
  
                    {_id: new ObjectId(postId) },
                    { 
                        // incrementing likes by one
                        $inc: {likes: 1 },

                        // adding user id to the likeIds array of the post
                        $push: { likedIds: uid }
                    }
                )
            }
            else {
                res.status(400).json(false)
            }
        }

        // updated post
        const updatedPost = await db.collection('posts').findOne({ _id: new ObjectId(postId) })


        // checking if updated post exists
        if(updatedPost) {

            // displaying updated likeIds
            console.log(updatedPost.likedIds)
            console.log("like made")

            // returning status and updated post
            res.status(200).json(updatedPost)

        }


    }
    catch (error) {
        console.log("like failed")
        console.error(error.message)
    }
    finally {
        await client.close()
    }

})




app.put('/api/:postId/unlike', async (req, res) => {
    const client = new MongoClient(process.env.MONGODB_URI)
    const postId = req.params.postId;
    const uid = req.user.uid

    console.log(uid)

    console.log("attempting to unlike")
    try {
        await client.connect()
        const db = client.db('SocialApp');
    
        const post = await db.collection('posts').findOne({ _id: new ObjectId(postId) })
        console.log("got original post")

        const likedIds = post.likedIds || [];
        console.log(`Liked IDs: ${likedIds}`)

        const canUnLike = uid && likedIds.includes(uid)
        console.log(`Can Unlike: ${canUnLike}`);

        //  checking if post exists
        if(post) {

            console.log("post checked")
            // removing like and userId from likedIds array
            if(canUnLike) {
                console.log("can unlike")
                await db.collection("posts").updateOne(
                    {_id: new ObjectId(postId) },
                    {
                        $inc: {likes: -1 },

                        // removing the userId from the likedIds array
                        $pull: { likedIds: uid }
                    }
                )
            }
        }
        const updatedPost = await db.collection('posts').findOne({ _id: new ObjectId(postId) })

        if(updatedPost) {
            console.log("unlike made")
            res.status(200).json(updatedPost)
        }
        else {
            res.status(500).json({ message: "Failed to update post" })
        }

    }
    catch (error) {
        console.log("like failed")
        console.error(error.message)
    }
    finally {
        await client.close()
    } 

})











// fetching new comment after a comment is posted

app.get('/api/post/:postId/comment', async (req, res) => {
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

app.post('/api/posts/:postId/comment', async (req, res) => {
    const client = new MongoClient(process.env.MONGODB_URI)
    const { postId } = req.params
    const { body, date } = req.body;

    const { email } = req.user

    console.log("Attempting to comment")


     try {
        await client.connect()
        const db = client.db('SocialApp')
            
        const post = await db.collection('posts').updateOne({ _id: new ObjectId(postId) }, {
            $push: { comments: { body, date: new Date(date), postedBy: email }} 
        })

        console.log("Comment Made")
        res.status(200).json(post)
    }
    catch (error) {
            console.log(error)
            res.status(500).json({ message: "Error:", error })
    } 
    finally {
        await client.close();
    }
})


















app.delete('/api/post/:id/:imageId', async (req, res) => {
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
        res.status(200).json({ message: "Post deleted successfully" })
    }
    catch (error) {
        console.error(error)
    }

})



const PORT = process.env.PORT || 5000


mongoose.connect(process.env.MONGODB_URI, {
    dbName: "SocialApp"
}).then(() => {
    app.listen(PORT, () => {
        console.log("Connected on PORT")
    })
}).catch(error => {
    console.log(error)
})
