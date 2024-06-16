import { useState, useEffect } from "react"
import axios from "axios"


import useUser from "../hooks/useUser"

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
    likedIds: string[]
  }
  
//   interface Photos {
//     [key: string]: string;
//   }
  
  interface Comments {
    body: string,
    date: Date
  }

const Profile = () => {

    const { user, isLoading } = useUser();

    const [posts, setPosts] = useState<Data[]>([])

    const fetchUserPosts = async () => {

        if(!user) {
            return
        }

        try {
            const token = user && await user.getIdToken();
            const headers = token ? { authtoken: token } : {}
            const response = await axios({
                method: 'GET',
                url: `http://localhost:5000/api/profile/${user.uid}`,
                headers: { Authorization: `${headers}`}
            })
            console.log(response.data)
            setPosts(response.data)
        }
        catch(error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if(user && !isLoading) {
            fetchUserPosts()
        }
    }, [user])

    return (
        <main>
            {posts.map(post => (
                <div key={post._id}>
                    <p>{post.body}</p>
                </div>
            ))}
        </main>
    )
}

export default Profile