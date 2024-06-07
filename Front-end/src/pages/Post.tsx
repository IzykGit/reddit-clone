import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { useLocation } from 'react-router-dom'
import axios from 'axios'

// import styles from '../styles/Post.module.css'



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
    comments: Comments[]
    date: string;
  }


const Post = () => {


    // grabbing post id from home page
    const location = useLocation();
    const postId = location.state.postId
    console.log(postId)

    const [post, setPost] = useState<Data | null>(null)
    const [comments, setComments] = useState<Comments[]>([])

    const [postDate, setPostDate] = useState("")

    useEffect(() => {

        // fetching post data from database
        if(postId) {
            const fetchPost = async () => {
                await axios.get(`http://localhost:5000/post/${postId}`)
                .then(response => {
                    setPost(response.data)

                    setComments(response.data.comments)
                    console.log(comments)
                })
            }

            fetchPost()
        }
        else {
            return
        }
    }, [])

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
            setPostDate("Loading...")
        }
    }, [post?.date])


    console.log(comments)
    return (
        <>
        <Navbar />

        <main>
            <div>
                <h1>{post?.title}</h1>
                <p>{post?.body}</p>
                <p>{post?.name}</p>
                <p>{postDate}</p>
            </div>

            {comments.map((comment, index) => (
                
                // can now display comments, still need to fix comment date
                <div key={index}>
                    <p>{comment.body}</p>
                    
                </div>
            ))}
        </main>
        </>
    )
}

export default Post