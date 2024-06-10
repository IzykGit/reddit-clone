import { useEffect, useState } from "react"
import axios from "axios"

import AOS from 'aos';
import 'aos/dist/aos.css'

import { Link } from "react-router-dom"

import Navbar from "../components/Navbar"

import styles from "../styles/Home.module.css"
import CreatePost from "../components/CreatePost"



// defining data
interface Data {
  name: string,
  title: string,
  body: string,
  _id: string,
  date: Date,
  imageId: string,
  likes: number
  comments: Comments[]
}

interface Photos {
  [key: string]: string;
}

interface Comments {
  body: string,
  date: Date
}


// type PostDates = {
//   [key: string]: string;
// };

const Home = () => {


  // usestate to assign data
  const [posts, setPosts] = useState<Data[]>([])
  
  const [photos, setPhotos] = useState<Photos>({})

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

                    <Link className={styles.media_link} to={`/post/${post._id}`} state={{ postId: post._id, imageId: post.imageId }}>
                      <div className={styles.post_body}>
                          <p>{post.body}</p>
                      </div>


                      {/* setting photo ids */}
                      {photos[post.imageId] && (
                          <img className={styles.post_image} src={`data:image/jpeg;base64,${photos[post.imageId]}`} alt="Post Image"/>
                      )}
                    </Link>
                      
                    <p>{post.likes} likes</p>
                      

                    <div>
                        {post.comments.length > 0 && (
                          <div>
                            <p>Top Comment:</p>
                            <p>{post.comments[0].body}</p>
                          </div>
                        )}
                    </div>
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