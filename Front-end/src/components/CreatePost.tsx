import { useEffect, useState, useRef } from "react";
import TextareaAutosize from 'react-textarea-autosize';
import axios from "axios";
import styles from '../styles/CreatePost.module.css'

import useUser from "../hooks/useUser"

import Upload from '../assets/upload.png'

const CreatePost = ({refreshPosts}: {refreshPosts: VoidFunction}) => {

    const { user } = useUser()

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // setting data for post body
    const [body, setBody] = useState("");

    const [file, setFile] = useState<File | null>(null)
    const [fileUrl, setFileUrl] = useState<string | undefined>(undefined)

    const [imageId, setImageId] = useState<string | null>(null)

    const [fileErr, setFileErr] = useState("")
    console.log(fileErr)
    

    const [disabled, setDisabled] = useState(false)

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setFile(event.target.files[0]);
        }
    };

    useEffect(() => {
        if(file instanceof File) {
            const url = URL.createObjectURL(file!);
            setFileUrl(url)
        }
    }, [file])

    const handleClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
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

            if(body.length > 250) {
                return
            }
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
        const validImageTypes = [
            "image/jpeg", "image/jpg",
            "image/avif", "image/png",
            "image/gif", "image/svg",
            "image/webp", "image/raw"
        ]
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
                    <TextareaAutosize id="textcontent" value={body} onChange={(e) => {
                        setBody(e.target.value)
                    }} required className={body.length <= 250 ? styles.textarea : styles.textarea_error}/>
                </div>
                
                {file ? (
                    <div>
                        {fileUrl && <img src={fileUrl} aria-label={`${file?.name}`} className={styles.image_preview}/>}
                        <button type="button" onClick={() => {
                            setFile(null);
                            setDisabled(false)
                        }} className={styles.remove_image}>Remove Image</button> 
                    </div>
                ) : (
                    ""
                )}



                <div className={styles.inputs}>

                    <div className={styles.input_post}>
                        <button type="submit"
                        className={styles.post_button} disabled={disabled}>{disabled ? "Cannot Post" : "Post" }</button>

                        <label htmlFor="file">Image</label>
                        <input id="file" type="file" style={{display: "none"}} onChange={handleFileChange} ref={fileInputRef}/>
                        <button className={styles.upload_image} type="button" onClick={handleClick} aria-label="Upload Your Image">
                            <img src={Upload} aria-label="Upload Image" />
                        </button>

                    </div>

                    <p className={body.length <= 250 ? styles.character_counter : styles.character_counter_error}>
                        {body.length === 0 ? "" : body.length}
                    </p>
                </div>
                
            </form>
        ) : (
            <p>Log in to create post</p>
        )}
        </>
    )
}

export default CreatePost
