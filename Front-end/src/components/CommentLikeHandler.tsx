import { useState, useEffect } from "react"

import axios from "axios"
import useUser from "../hooks/useUser"


const CommentLikeHandler = ({ postId, commentId, commentLikes }: { postId: string, commentId: string, commentLikes: number }) => {

    const { user } = useUser()

    const [clicked, setClicked] = useState(false)
    const [likes, setLikes] = useState(commentLikes)

    console.log(commentLikes)
    const likeComment = async () => {

        if(postId) {
            const token = await user?.getIdToken();
            const headers = token ? { Authorization: `Bearer ${token}` } : {}
            try {
                const response = await axios({
                    method: "PUT",
                    url: `http://localhost:5000/api/${postId}/${commentId}/like`,
                    headers: headers
                })

                setLikes(response.data.likes)


            }
            catch (error) {
                console.log(error)
            }
        }
    }

    useEffect(() => {
        likeComment()
    }, [clicked])


    return (
        <>
        <p>{likes ? likes : "No Likes"}</p>
        {user ? (
            <button
            type="button"
            aria-label="Like and Unlike button"
            onClick={() => {
                setClicked(!clicked)
            }}>Like</button>
        ) : (
            <div></div>
        )}
        </>

    )

}

export default CommentLikeHandler