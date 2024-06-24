import { useEffect, useState } from "react";
import axios from "axios";
import styles from '../styles/CreatePost.module.css'

import useUser from "../hooks/useUser"

const CreatePost = ({refreshPosts}: {refreshPosts: VoidFunction}) => {

    const { user } = useUser()

    // setting data for post body
    const [body, setBody] = useState("");

    const [file, setFile] = useState<File | null>(null)
    const [imageId, setImageId] = useState<string | null>(null)

    const [fileErr, setFileErr] = useState("")

    const [disabled, setDisabled] = useState(false)

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
          setFile(event.target.files[0]);
        }
      };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        setDisabled(true)
        event.preventDefault();

        if(!user) {
            return
        }

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
            formData.append("userId", user.uid)

            const token = await user?.getIdToken();
            const headers = token ? { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } : { "Content-Type": "multipart/form-data" };

            // creating post
            const response = await axios({
                method: "POST",
                url: "http://localhost:5000/api/post",
                data: formData,
                headers: headers
            });
            setBody("")
            setFile(null)
            setDisabled(false)

            refreshPosts()
            console.log("Post created:", response.data);
        } catch (error) {
            console.error("Error creating post:", error);
        }
        
    };

    useEffect(() => {
        // generating a unique image identifier when image is uploaded
        const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
        if(file) {
            if(!validImageTypes.includes(file.type)) {
                setDisabled(true)
                return setFileErr("Must be an image")
            }
            setFileErr("")
            setDisabled(false)

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
                    <p>{fileErr.length == 0 ? "" : "Must be an image"}</p>
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
