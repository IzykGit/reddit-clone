import { useEffect, useState } from "react"
import axios from "axios"

import AOS from 'aos';
import 'aos/dist/aos.css'

import { Link } from "react-router-dom"

import Navbar from "../components/Navbar"

import styles from "../styles/Home.module.css"
import CreatePost from "../components/CreatePost"

import LikeHandler from "../components/LikeHandler";

import useUser from "../hooks/useUser"
import DeleteFunc from "../components/deletePost";


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
  userName: string
}


const Home = () => {

  const { user } = useUser();


  // usestate to assign data
  const [posts, setPosts] = useState<Data[]>([])

  // keeping track of current page
  const [currentPage, setCurrentPage] = useState(1);

  // keep track of number of pages
  const [totalPages, setTotalPages] = useState(0);
  
  const [photos, setPhotos] = useState<Photos>({})

  const [loading, setLoading] = useState(true)

  const [refresh, setRefresh] = useState(false)


  useEffect(() => {
    AOS.init({
      duration: 500,
      once: true
    })
  }, [])




  const fetchPosts = async (page = 1) => {
    try {
      const token = await user?.getIdToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {}
      const response = await axios({
        method: "GET",
        url: "http://localhost:5000/api/home",
        headers: headers,
        params: { page, limit: 10 } 
      })
  
          
      setPosts(response.data.posts);
  
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.currentPage);
    }
    catch(error) {
      console.log(error)
    }
  }


  useEffect(() => {
    setLoading(true); // Set loading to true before fetching data
    fetchPosts(currentPage).then(() => setLoading(false)); // Set loading to false after fetching data
  }, [currentPage, refresh])

  
  

  const fetchImage = async (imageId: string) => {
    try {

      // fetching photos base on image id
      const response = await axios({
        method: "GET",
        url: `http://localhost:5000/api/home/${imageId}`
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



  // logging data
  useEffect(() => {
    console.log("backend data:", posts)
  }, [posts])


  const refreshPosts = () => {
    setRefresh(!refresh)
  }

  return (
    <>
    <Navbar />
    <main className={styles.home_main}>


      <section className={styles.content}>
        
      <CreatePost refreshPosts={refreshPosts}/>

      {loading ? (
        <p className={styles.loading}>Loading...</p>
      ) : (
        <div>
          {posts.length === 0 ? (
            <p>No posts on your timeline!</p>
          ) : (
            posts.map(post => (
              <div data-aos="fade-up" key={post._id} className={styles.media_post_div}>
                    <Link className={styles.post_username} to={`/profile/${post.userName}`} state={{ userName: post.userName }}>
                      <h2 >{post.userName}</h2>
                    </Link>

                    
                    <Link className={styles.media_link} to={`/post/${post._id}`} state={{ postId: post._id, imageId: post.imageId }}>

                      
                      <div className={styles.post_body}>
                          <p>{post.body}</p>
                      </div>


                      {/* setting photo ids */}
                      {photos[post.imageId] && (
                          <img className={styles.post_image} src={`data:image/jpeg;base64,${photos[post.imageId]}`} alt="Post Image"/>
                      )}
                    </Link>

                    <div className={styles.like_delete_container}>
                      {/* like and unlike handler, see src/components/LikeHandler.tsx */}
                      <LikeHandler postId={post!._id} postLikes={post!.likes} likedIds={post!.likedIds}/>
                        

                      {/* if the post userId matches the current logged in user
                      the user can make a delete request on that page */}
                      {user && post.userId === user.uid && (
                        <DeleteFunc postId={post._id} imageId={post.imageId} refreshPosts={refreshPosts}/>
                      )}
                    </div>


                    <div>
                        {post.comments.length > 0 && (
                          <div>
                            <p>Top Comment:</p>
                            <p>{post.comments[0].userName}</p>
                            <p>{post.comments[0].body}</p>
                          </div>
                        )}
                    </div>
              </div>

            ))

          )
          }
          </div>
        )
      }

      <div className={styles.pagination}>
          <button type="button" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
              Previous
          </button>
          <button type="button" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
              Next
          </button>
      </div>

    </section>




    </main>
    </>
  )
}

export default Home