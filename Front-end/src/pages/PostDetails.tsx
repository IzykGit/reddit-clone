import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { useLocation } from 'react-router-dom'
import axios from 'axios'

import styles from '../styles/PostDetails.module.css'

import Comment from '../components/Comment'

import DeleteFunc from "../components/deletePost.tsx";
import LikeHandler from '../components/LikeHandler.tsx'

import useUser from "../hooks/useUser.ts"
import deleteComment from '../hooks/deleteComment.ts'





// defining data
interface Comments {
    body: string,
    date: Date
    postedBy: string,
    id: string,
    userId: string,
    likes: number,
    likedIds: string[]
}

interface Data {
    userId: string,
    title: string,
    body: string,
    _id: string,
    date: Date,
    imageId: string,
    likes: number,
    comments: Comments[],
    likedIds: string[]
}


// default data incase a post isnt present
const defaultPost: Data = {
    userId: '',
    title: '',
    body: '',
    _id: '',
    date: new Date(),
    imageId: '',
    likes: 0,
    comments: [],
    likedIds: [""]
};

const Post = () => {

    const { user } = useUser();

    // grabbing post and image id from home page
    const location = useLocation();
    const postId = location.state?.postId
    const imageId = location.state?.imageId

    // setting post state
    const [post, setPost] = useState<Data>(defaultPost)

    // setting media state
    const [media, setMedia] = useState("")

    // setting initial comments array
    const [comments, setComments] = useState<Comments[]>([])

    // setting post date
    const [postDate, setPostDate] = useState("")

    // disabling delete button temporarily 
    const [disabled, setDisabled] = useState(false)





    useEffect(() => {

        // fetching post data from database
        const fetchPost = async () => {
            try {

                // getting user token
                const token = await user?.getIdToken();
                const headers = token ? { Authorization: `Bearer ${token}` } : {}

                // fetching with axios
                const response = await axios({
                    method: "GET",
                    url: `http://localhost:5000/api/post/${postId}`,
                    headers: headers
                });
                setPost(response.data);
                setComments(response.data.comments)
            } catch (error) {
                console.error('Error fetching post data:', error);
            }
        };

        //fetching image from database
        const fetchImage = async () => {

            const token = await user?.getIdToken();
            const headers = token ? { Authorization: `Bearer ${token}` } : {}
            try {
                const response = await axios({
                    method: "GET",
                    url: `http://localhost:5000/api/home/${imageId}`,
                    headers: headers
                })
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


    }, [postId, imageId, user])

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

        setDisabled(true)

        try {
            const response = await axios({
                method: "GET",
                url: `http://localhost:5000/api/post/${postId}`
            });
            setComments(response.data.comments);
            console.log(comments)
        }
        catch (error) {
            console.log(error)
        }
        finally {
            setDisabled(false)
        }

    }



    return (
        <>
        <Navbar />

        <main className={styles.main}>

        <div className={styles.content}>

        {post ? (
            <div className={styles.detail_container}>

                <h1>{post?.title}</h1>
                <p>{post?.body}</p>
                {media && <img src={media} alt="" className={styles.post_image}/>}
                <p>{postDate}</p>

                {/* like and unlike handler, see src/components/LikeHandler.tsx */}
                <LikeHandler postId={post._id} postLikes={post.likes} likedIds={post.likedIds}/>
                

                {/* deleting post handler, see src/api/deletePost.tsx */}
                {user && post.userId === user.uid && (
                <DeleteFunc postId={post?._id} imageId={post?.imageId} />
                )}
            </div>   
        ) : (
            <p>No post</p>
        )}


            
            <Comment refreshComments={refreshComments} postId={post?._id}/>

            <div className={styles.comment_container}>
                <p>Comments</p>
                {comments.length === 0 ? (
                    <p>No comments</p>
                ) : comments.map((comment, index) => (
                    
                    // can now display comments, still need to fix comment date
                    <div className={styles.comment} key={index}>
                        <p>{comment.postedBy}</p>
                        <p>{comment.body}</p>

                        {user?.uid === comment.userId ? (
                            <button type='button'
                            onClick={() => {
                                deleteComment({ 
                                    commentId: comment.id,
                                    postId: post._id,
                                    refreshComments                            
                                })
                                
                                console.log(comment.id)
                            }}   
                            disabled={disabled}
                            >Delete Comment</button>
                        ) : (
                            <p></p>
                        )}

                    </div>
                ))}
            </div>
        </div>


        </main>
        </>
    )
}

export default Post