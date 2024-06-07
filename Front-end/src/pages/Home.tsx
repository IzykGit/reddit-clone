import { useEffect, useState } from "react"
import axios from "axios"

import { Link } from "react-router-dom"

import Navbar from "../components/Navbar"

import styles from "../styles/Home.module.css"


// defining data
interface Data {
  name: string,
  title: string,
  body: string,
  _id: string,
  date: Date
}

const Home = () => {


  // usestate to assign data
  const [data, setData] = useState<Data[]>([])


  useEffect(() => {


    // fetching all posts from database
    const fetchData = async () => {
      await axios.get("http://localhost:5000/home")
      .then(response => {
        setData(response.data)

      })
      .catch(error => console.error(error))
    }
    fetchData()

  }, [])



  // logging data
  useEffect(() => {
    console.log("backend data:", data)
  }, [data])

  return (
    <>
    <Navbar />
    <main className={styles.home_main}>
        {data.map(post => (
          <Link key={post._id} className={styles.media_post_link} to={`/post/${post._id}`} state={{ postId: post._id }}>
            <div className={styles.media_post}>
                <p className={styles.post_title} style={{fontWeight: "bold", fontSize: "1.5rem"}}>{post.title}</p>
                <p>{post.body}</p>
                <p>{post.date}</p>
            </div>
          </Link>
        ))}
    </main>
    </>
  )
}

export default Home