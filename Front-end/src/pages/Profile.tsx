import { useState, useEffect } from "react"
import axios from "axios"
import { Link } from "react-router-dom"

import styles from '../styles/Profile.module.css'


import useUser from "../hooks/useUser"

import Navbar from "../components/Navbar"
import LikeHandler from "../components/LikeHandler"
import DeleteFunc from "../components/deletePost"

// defining data
interface Data {
    userId: string,
    title: string,
    body: string,
    _id: string,
    date: Date,
    imageId: string,
    likes: number,
    comments: Comments[],
    likedIds: string[],
    userName: string
  }
  
  interface Photos {
    [key: string]: string;
  }
  
interface Comments {
    body: string,
    date: Date
}

const Profile = () => {

    const { user, isLoading } = useUser();

    const [posts, setPosts] = useState<Data[]>([])

    const [userInfo, setUserInfo] = useState({ userName: "Loading..." })

    const [photos, setPhotos] = useState<Photos>({})

    const [loading, setLoading] = useState(true)
    console.log(loading)

    const fetchUserPosts = async () => {

        if(!user) {
            return
        }

        try {
            const token = await user?.getIdToken();
            const headers = token ? { Authorization: `Bearer ${token}` } : {}
            const response = await axios({
                method: 'GET',
                url: `http://localhost:5000/api/profile`,
                headers: headers
            })
            console.log(response.data.user)
            console.log(response.data.posts)
            setPosts(response.data.posts)
            setUserInfo(response.data.user)
        }
        catch(error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if(user && !isLoading) {
            fetchUserPosts()
        }
    }, [user])


    const fetchImage = async (imageId: string) => {
        try {
    
          // fetching photos base on image id
          const response = await axios({
            method: "GET",
            url: `http://localhost:5000/api/profile/${imageId}`
          });
    
          setPhotos((prevPhotos) => ({
            ...prevPhotos,
            [imageId]: response.data.image,
          }));
        } catch (error) {
          console.error(`Error fetching image for imageId ${imageId}:`, error);
        }
      };
    
    
    
    useEffect(() => {
        const fetchImages = async () => {
            setLoading(true);
            for (const post of posts) {
                if (post.imageId && !photos[post.imageId]) {
                await fetchImage(post.imageId);
                }
            }
            setLoading(false);
        };
        if (posts.length > 0) {
          fetchImages();
        }
    }, [posts]);

    return (
        <>
        <Navbar />
        <main className={styles.profile_main}>

        <div className={styles.column_2}>
            <section className={styles.user_info}>
                <h1>{userInfo.userName}</h1>
            </section>

            <section className={styles.posts_section}>
                {posts.length === 0 ? (
                    <p>This user has no posts!</p>
                ) : (
                posts?.map(post => (
                    <div key={post._id} className={styles.post}>

                        <Link className={styles.media_link} to={`/post/${post._id}`} state={{ postId: post._id, imageId: post.imageId }}>
                        <p>{post.body}</p>


                        {photos[post.imageId] && (
                            <img className={styles.post_image} src={`data:image/jpeg;base64,${photos[post.imageId]}`} alt="Post Image"/>
                        )}
                        </Link>


                        <LikeHandler postId={post!._id} postLikes={post!.likes} likedIds={post!.likedIds}/>
                    
                        <DeleteFunc postId={post?._id} imageId={post?.imageId} refreshPosts={() => null} />
                        <div>
                            {post.comments.length > 0 && (
                                <div>
                                <p>Top Comment:</p>
                                <p>{post.comments[0].body}</p>
                            </div>
                            )}
                        </div>
                    </div>
                    ))
                )}

            </section>
      </div>

        </main>
        </>
    )
}

export default Profile