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
  imageId: string
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

  const [postId, setPostId] = useState("");
  const [photoId, setPhotoId] = useState("");


  const [loading, setLoading] = useState(true)
  // const [postDates, setPostDates] = useState<PostDates>({}); // Initialize with the correct type


  // // this useMemo calculates the dates of each post
  // useMemo(() => {

  //   const dates = data.reduce<PostDates>((acc, post) => {
  //     const originDate = post.date;
  //     const newDate = new Date(originDate);

  //     const year = newDate.getFullYear();
  //     const month = (newDate.getMonth() + 1).toString().padStart(2, '0');
  //     const day = newDate.getDate().toString().padStart(2, '0');

  //     const formattedDate = `${year}-${month}-${day}`;

  //     acc[post._id] = formattedDate;

  //     return acc;
  //   }, {});

  //   setPostDates(dates);
  // }, [data]);

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





  useEffect(() => {

    // deleting post data from database
    if(postId) {

      try {
        const fetchPost = async () => {
          await axios.delete(`http://localhost:5000/post/${postId}/${photoId}`)
        }

        fetchPost()
        window.location.reload()
      }
      catch (error) {
        console.log(error)
      }

    }
    else {
        return
    }


  }, [postId])

  // logging data
  useEffect(() => {
    console.log("backend data:", posts)
  }, [posts])

  return (
    <>
    <Navbar />
    <main className={styles.home_main}>
      <CreatePost />


        {posts.map(post => (
            <div data-aos="fade-down" key={post._id} className={styles.media_post_div}>

                <Link className={styles.media_link} to={`/post/${post._id}`} state={{ postId: post._id }}>
                  <div className={styles.post_body}>
                    <p>{post.body}</p>
                  </div>


                  {/* setting photo ids */}
                  {photos[post.imageId] && (
                    <img className={styles.post_image} src={`data:image/jpeg;base64,${photos[post.imageId]}`} alt="Post Image"/>
                  )}
                </Link>
                
                <button onClick={() => {
                  setPostId(post._id)
                  setPhotoId(post.imageId)
                }}
                className={styles.delete_button}
                type="button">Delete</button>

            </div>

        ))}

    </main>
    </>
  )
}

export default Home