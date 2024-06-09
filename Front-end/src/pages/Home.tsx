import { useEffect, useState } from "react"
import axios from "axios"

import AOS from 'aos';
import 'aos/dist/aos.css'

import { Link } from "react-router-dom"

import Navbar from "../components/Navbar"

import styles from "../styles/Home.module.css"
import CreatePost from "../components/CreatePost"
import LikeButton from "../api/likePost";
import DeleteButton from "../api/deletePost";


// defining data
interface Data {
  name: string,
  title: string,
  body: string,
  _id: string,
  date: Date,
  imageId: string,
  likes: number
}

interface Photos {
  [key: string]: string;
}


// type PostDates = {
//   [key: string]: string;
// };

const Home = () => {


  // usestate to assign data
  const [posts, setPosts] = useState<Data[]>([])
  
  const [photos, setPhotos] = useState<Photos>({})

  const [reload, setReload] = useState(false)

  const [loading, setLoading] = useState(true)

  

  useEffect(() => {
    AOS.init({
      duration: 500,
      once: true
    })
  })




  const fetchPosts = async () => {
    await axios.get("http://localhost:5000/home")
      .then(response => {
        const sortedData = response.data.sort((a: Data, b: Data) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setPosts(sortedData);
      })
      .catch(error => console.error(error))
  }


  useEffect(() => {
    setLoading(true); // Set loading to true before fetching data
    fetchPosts().then(() => setLoading(false)); // Set loading to false after fetching data
  }, [])

  
  

  const fetchImage = async (imageId: string) => {
    try {

      // fetching photos base on image id
      const response = await axios.get(`http://localhost:5000/home/${imageId}`);
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


  useEffect(() => {
    if(!reload) {
      return
    }
    window.location.reload()
  }, [reload])

  const windowReload = () => {
    setTimeout(() => {
      setReload(!reload)
    }, 100)
  }

  return (
    <>
    <Navbar />
    <main className={styles.home_main}>


      <section className={styles.column_2}>
        
      <CreatePost />

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {posts.map(post => (
              <div data-aos="fade-up" key={post._id} className={styles.media_post_div}>

                  <Link className={styles.media_link} to={`/post/${post._id}`} state={{ postId: post._id }}>
                    <div className={styles.post_body}>
                      <p>{post.body}</p>
                    </div>


                    {/* setting photo ids */}
                    {photos[post.imageId] && (
                      <img className={styles.post_image} src={`data:image/jpeg;base64,${photos[post.imageId]}`} alt="Post Image"/>
                    )}
                  </Link>

                  <p>{post.likes}</p>
      
                  <button type="button" onClick={() => LikeButton({id: post._id, likes: post.likes})}>Like</button>
                  <button type="button" onClick={() => { DeleteButton({id: post._id, imageId: post.imageId}); windowReload() }}>Delete</button>
              </div>

            ))}
          </div>
        )
      }

    </section>




    </main>
    </>
  )
}

export default Home