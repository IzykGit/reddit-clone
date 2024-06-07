import { useEffect, useState } from "react"
import axios from "axios"

import { Link } from "react-router-dom"

import Navbar from "../components/Navbar"


// defining data
interface Data {
  name: string,
  title: string,
  body: string
  _id: string
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
    <main>
        {data.map(post => (
          <div key={post._id}>
            <Link to={`/post/${post._id}`} state={{ postId: post._id }}>
              <p style={{fontWeight: "bold", fontSize: "1.5rem"}}>{post.title}</p>
              <p>{post.body}</p>
            </Link>
          </div>
        ))}
    </main>
    </>
  )
}

export default Home