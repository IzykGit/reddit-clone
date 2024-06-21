import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import axios from "axios"
import { Link } from "react-router-dom"
import LikeHandler from "../components/LikeHandler"

import styles from '../styles/ProfileVisitor.module.css'
import Navbar from "../components/Navbar"

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

const ProfileVisitor = () => {

  const location = useLocation();
  const userName = location.state.userName

  const [posts, setPosts] = useState<Data[]>([])

  const [photos, setPhotos] = useState<Photos>({})

  const [loading, setLoading] = useState(true)
  console.log(loading)


  useEffect(() => {
    if(userName) {
      
      const fetchUserPosts = async () => {

        try {
          
          const response = await axios({
            method: "GET",
            url: `http://localhost:5000/api/profile-visitor/${userName}`
          });

          setPosts(response.data)
        }
        catch(error) {
          console.log(error)
        }
      }
      
      fetchUserPosts()



    }


  }, [userName])



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
    <main className={styles.visitor_main}>
      
      <div className={styles.column_2}>
        <section className={styles.user_info}>
          <h1>{userName}</h1>
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

export default ProfileVisitor