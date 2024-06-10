import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { useLocation } from 'react-router-dom'
import axios from 'axios'

import styles from '../styles/PostDetails.module.css'

import Comment from '../components/Comment'

import DeleteFunc from "../api/deletePost.tsx";
import LikeHandler from '../components/LikeHandler.tsx'





// defining data
interface Comments {
    body: string,
    date: Date
}

interface Data {
    username: string,
    title: string,
    body: string,
    _id: string,
    date: Date,
    imageId: string,
    likes: number,
    comments: Comments[]
}

const defaultPost: Data = {
    username: '',
    title: '',
    body: '',
    _id: '',
    date: new Date(),
    imageId: '',
    likes: 0,
    comments: []
};

const Post = () => {



    // grabbing post and image id from home page
    const location = useLocation();
    const postId = location.state?.postId
    const imageId = location.state?.imageId

    console.log(postId)
    console.log(imageId)

    const [post, setPost] = useState<Data>(defaultPost)
    const [media, setMedia] = useState("")

    const [comments, setComments] = useState<Comments[]>([])

    const [postDate, setPostDate] = useState("")


    useEffect(() => {

        // fetching post data from database
        const fetchPost = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/post/${postId}`);
                setPost(response.data);
                setComments(response.data.comments)
            } catch (error) {
                console.error('Error fetching post data:', error);
            }
        };
        const fetchImage = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/home/${imageId}`)
                const base64Image = response.data.image;
                const imageUrl = `data:image/jpeg;base64,${base64Image}`

                setMedia(imageUrl)
            } catch (error) {
                console.error('Error fetching image:', error);
            }
        };
      
        if (postId) {
            fetchPost();
        }
      
        if (imageId) {
            fetchImage();
        }

        // fetchComments()


    }, [postId, imageId])

    // formating the date to be displayed on post

    useEffect(() => {

        if(post?.date) {
            
            const originDate = post?.date;
            const newDate = new Date(originDate!)

            const year = newDate.getFullYear()
            const month = (newDate.getMonth() + 1).toString().padStart(2, '0');
            const day = newDate.getDate().toString().padStart(2, '0');
        
            setPostDate(`${year}-${month}-${day}`) 
        }
        else {
            setPostDate("")
        }
    }, [post?.date])


    // refreshing the comments when a comment is made

    const refreshComments = async () => {
        const response = await axios.get(`http://localhost:5000/post/${postId}`);
        setComments(response.data.comments);
    }



    console.log(comments)
    return (
        <>
        <Navbar />

        <main className={styles.main}>
            <div className={styles.detail_container}>
                <h1>{post?.title}</h1>
                <p>{post?.body}</p>
                {media && <img src={media} alt="" className={styles.post_image}/>}
                <p>{post?.username}</p>
                <p>{postDate}</p>



                <LikeHandler postId={post._id} postLikes={post.likes}/>

                <DeleteFunc id={post?._id} imageId={post?.imageId} />

            </div>

            
            <Comment refreshComments={refreshComments} postId={post?._id}/>

            <div className={styles.comment_container}>
                <p>Comments</p>
                {comments.length === 0 ? (
                    <p>No comments</p>
                ) : comments.map((comment, index) => (
                    
                    // can now display comments, still need to fix comment date
                    <div className={styles.comment} key={index}>
                        <p>{comment.body}</p>
                        
                    </div>
                ))}
            </div>

        </main>
        </>
    )
}

export default Post