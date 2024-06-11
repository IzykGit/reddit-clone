import { useState } from "react"

import likePost from "../api/likePost"
import unlikePost from "../api/unlikePost"

import useUser from "../hooks/useUser"


const LikeHandler = ({ postId, postLikes }: { postId: string, postLikes: number }) => {

    const { user, isLoading } = useUser();

    const [handler, setHandler] = useState(false)
    const [likes, setLikes] = useState(postLikes)

    const handleLike = async () => {

        if(handler === false) {
            console.log("Like Clicked")
            likePost({ id: postId, likes: postLikes})
            setLikes(likes + 1)
            setHandler(true)
        }
        else if (handler === true ) {
            console.log("Unlike Clicked")
            unlikePost({ id: postId, likes: postLikes})
            setLikes(likes - 1)
            setHandler(false)
        }
    }

    return (
        <>
        <div>
            <p>{likes ? likes : "No Likes"}</p>

        </div>
        {user ?
            <button onClick={() => handleLike()} type="button">Like</button>
            :
            <p>Log in to like</p>
        }
        </>
    )
}

export default LikeHandler