import { useEffect, useState } from "react"
import axios from "axios"

import Navbar from "../components/Navbar"


interface Data {
  name: string,
  _id: string
}

const Home = () => {

  const [data, setData] = useState<Data[]>([])

  useEffect(() => {

    const fetchData = async () => {
      await axios.get("http://localhost:5000/hello")
      .then(response => {
        setData(response.data)

      })
      .catch(error => console.error(error))
    }

    fetchData()

  }, [])

  useEffect(() => {
    console.log("backend data:", data)
  }, [data])

  return (
    <>
    <Navbar />
    <main>
        {data.map(post => (
          <div key={post._id}>
            <p>{post.name}</p>
          </div>
        ))}
    </main>
    </>
  )
}

export default Home