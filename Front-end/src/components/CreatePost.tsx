import { useEffect, useState } from "react";
import axios from "axios";
import styles from '../styles/CreatePost.module.css'

import useUser from "../hooks/useUser";

const CreatePost = () => {

    const { user } = useUser()

    // setting data for post body
    const [body, setBody] = useState("");

    const [file, setFile] = useState<File | null>(null)
    const [imageId, setImageId] = useState<string | null>(null)

    const [disabled, setDisabled] = useState(false)

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
          setFile(event.target.files[0]);
        }
      };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        setDisabled(true)
        event.preventDefault();

        try {
            const formData = new FormData();
            formData.append("body", body);
            if(file && imageId) {

                // setting file and imageId to form
                formData.append("file", file);
                formData.append("imageId", imageId)
            }
            formData.append("date", new Date().toISOString());
            formData.append("likes", `${0}`)
            formData.append("likedIds", JSON.stringify([]))

            // creating post
            const response = await axios.post("http://localhost:5000/post", formData, {
                headers: {
                "Content-Type": "multipart/form-data",
                },
            });
            setBody("")
            setFile(null)
            setDisabled(true)
            console.log("Post created:", response.data);
            window.location.reload()
        } catch (error) {
            console.error("Error creating post:", error);
        }
        
    };

    useEffect(() => {
        // generating a unique image identifier when image is uploaded

        if(file) {
            const fileStr = `${file?.name}`;
            console.log("File Str:", fileStr)

            const timestamp = Date.now().toString(); // getting current timestamp
            const randomNum = Math.floor(Math.random() * 1000000).toString(); // generating a random number
      
            const uniqueId = `${timestamp}-${randomNum}`;
            setImageId(uniqueId);
            console.log(uniqueId)
        }
        else {
            return
        }

    }, [file])

    
    return (
        <>
        {user ? (
            <form onSubmit={handleSubmit} className={styles.create_post}>
                <div className={styles.inputs}>
                    <label htmlFor="textcontent">Body</label>
                    <textarea id="textcontent" value={body} onChange={(e) => setBody(e.target.value)} required/>
                </div>
                <div className={styles.inputs}>
                    <label htmlFor="file">Image</label>
                    <input id="file" type="file" onChange={handleFileChange}/>
                </div>
                <button type="submit"
                disabled={disabled}>Create Post</button>
            </form>
        ) : (
            <p>Log in to create post</p>
        )}
        </>
    )
}

export default CreatePost
