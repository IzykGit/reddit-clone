import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { useLocation } from 'react-router-dom'
import axios from 'axios'



// defining data
interface Data {
    name: string,
    title: string,
    body: string
    _id: string
  }


const Post = () => {


    // grabbing post id from home page
    const location = useLocation();
    const postId = location.state.postId
    console.log(postId)

    const [post, setPost] = useState<Data | null>(null)

    useEffect(() => {
        const fetchPost = async () => {
            await axios.get(`http://localhost:5000/post/${postId}`)
            .then(response => {
                setPost(response.data)
                console.log(response.data)
            })
        }

        fetchPost()
    }, [])

    return (
        <>
        <Navbar />

        <main>
            <h1>{post?.title}</h1>
        </main>
        </>
    )
}

export default Post