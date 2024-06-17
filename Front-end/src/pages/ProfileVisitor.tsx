import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import axios from "axios"


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

//   interface Photos {
//     [key: string]: string;
//   }

interface Comments {
  body: string,
  date: Date
}

const ProfileVisitor = () => {

  const location = useLocation();
  const userName = location.state.userName

  const [posts, setPosts] = useState<Data[]>([])




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

  return (
    <main>
      {posts?.map(post => (
        <div key={post._id}>
          <p>{post.body}</p>
        </div>
      ))}
    </main>
  )
}

export default ProfileVisitor