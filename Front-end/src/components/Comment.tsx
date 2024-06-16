import { useEffect, useState } from "react"
import axios from "axios"
import styles from '../styles/Comment.module.css'

import useUser from "../hooks/useUser"

const Comment = ({ postId, refreshComments }: { postId: string | undefined, refreshComments: VoidFunction }) => {

    const { user } = useUser();

    const [body, setBody] = useState("")

    const [clicked, setClicked] = useState(false)

    const [disabled, setDisabled] = useState(true)

    useEffect(() => {
        if(disabled === false) {
            setDisabled(true)
        }
        else {
            setDisabled(false)
        }
    }, [clicked])

    const postComment = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setClicked(true)

        const commentData = {
            body,
            date: new Date().toISOString(),
        };

        try {
            if(postId) {
                await axios({
                    method: "POST",
                    url: `http://localhost:5000/api/posts/${postId}/comment`,
                    data: commentData,
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
                console.log("Comment Made")
                setBody("")
                refreshComments()
            }
        }
        catch (error) {
            console.log(error)
        }
        finally {
            setClicked(false)
        }

    }

    return (
        <>
        {user ?
        <form className={styles.comment_post} onSubmit={postComment}>
            <label htmlFor='comment'>leave a comment</label>
            <textarea id='comment' value={body} onChange={(e) => setBody(e.target.value)} required/>

            <button type="submit" disabled={disabled}>{disabled ? "..." : "Post"}</button>
        </form>
        :

        <div>
            <p>Log in to comment</p>
        </div>
        }
        </>
    )
}

export default Comment