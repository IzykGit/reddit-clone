import { useState } from "react"
import axios from "axios"
import styles from '../styles/Comment.module.css'

const Comment = ({ postId }: { postId: string }) => {

    const [body, setBody] = useState("")

    const [disableButton, setDisableButton] = useState(false)

    const postComment = async (event: React.FormEvent<HTMLFormElement>) => {

        event.preventDefault();

        const commentData = {
            body,
            date: new Date().toISOString(),
        };

        try {
            await axios.post(`http://localhost:5000/posts/${postId}/comment`, commentData, {
                headers: {
                    "Content-Type": "application/json",
                },
            })
            console.log("Comment Made")
            setBody("")
            setDisableButton(!disableButton)
        }
        catch (error) {
            console.log(error)
        }
    }

    return (
        <form className={styles.comment_post} onSubmit={postComment}>
            <label htmlFor='comment'>leave a comment</label>
            <textarea id='comment' value={body} onChange={(e) => setBody(e.target.value)} required/>

            <button type="submit" disabled={disableButton}>Post</button>
        </form>
    )
}

export default Comment