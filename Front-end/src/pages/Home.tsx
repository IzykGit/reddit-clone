import { useEffect, useState, useMemo } from "react"
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

type PostDates = {
  [key: string]: string;
};

const Home = () => {


  // usestate to assign data
  const [data, setData] = useState<Data[]>([])

  const [sort, setSort] = useState(false)

  const [postDates, setPostDates] = useState<PostDates>({}); // Initialize with the correct type


  // this useMemo calculates the dates of each post
  useMemo(() => {

    const dates = data.reduce<PostDates>((acc, post) => {
      const originDate = post.date;
      const newDate = new Date(originDate);

      const year = newDate.getFullYear();
      const month = (newDate.getMonth() + 1).toString().padStart(2, '0');
      const day = newDate.getDate().toString().padStart(2, '0');

      const formattedDate = `${year}-${month}-${day}`;

      acc[post._id] = formattedDate;

      return acc;
    }, {});

    setPostDates(dates);
  }, [data]);


  useEffect(() => {

    if(!sort) {
      // fetching all posts from database
      const fetchData = async () => {
        await axios.get("http://localhost:5000/home")
        .then(response => {
          const sortedData = response.data.sort((a: Data, b: Data) => new Date(b.date).getTime() - new Date(a.date).getTime());
          setData(sortedData);
        })
        .catch(error => console.error(error))
      }
      fetchData()
    }
    else if (sort) {
            // fetching all posts from database
            const fetchData = async () => {
              await axios.get("http://localhost:5000/home")
              .then(response => {
                setData(response.data)
              })
              .catch(error => console.error(error))
            }
            fetchData()
    }


  }, [sort])



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
                <p>{post.body.length > 350 ? post.body.substring(0, 200) + "..." : post.body}</p>

                {/* post dates */}
                <p>{postDates[post._id]}</p>
            </div>
          </Link>
        ))}
        <div className={styles.sort}>
          <button onClick={() => setSort(!sort)}>Sort</button>
        </div>
    </main>
    </>
  )
}

export default Home