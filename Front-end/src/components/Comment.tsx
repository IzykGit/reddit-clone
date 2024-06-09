import { useState } from "react"
import axios from "axios"
import styles from '../styles/Comment.module.css'

const Comment = ({ postId }: { postId: string }) => {

    const [body, setBody] = useState("")

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
        }
        catch (error) {
            console.log(error)
        }
    }

    return (
        <form className={styles.comment_post} onSubmit={postComment}>
            <label htmlFor='comment'>leave a comment</label>
            <textarea id='comment' value={body} onChange={(e) => setBody(e.target.value)}/>

            <button type="submit">Post</button>
        </form>
    )
}

export default Comment