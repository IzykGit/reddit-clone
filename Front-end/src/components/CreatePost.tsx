import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";


const CreatePost = () => {

    // setting data for post body
    const [body, setBody] = useState("");

    const [file, setFile] = useState<File | null>(null)
    const [imageId, setImageId] = useState<string | null>(null)

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
          setFile(event.target.files[0]);
        }
      };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const formData = new FormData();
            formData.append("body", body);
            if(file && imageId) {
                formData.append("file", file);
                formData.append("imageId", imageId)
            }
            formData.append("date", new Date().toISOString());

            // creating post
            const response = await axios.post("http://localhost:5000/post", formData, {
                headers: {
                "Content-Type": "multipart/form-data",
                },
            });
            setBody("")
            setFile(null)
            console.log("Post created:", response.data);
            window.location.reload()
        } catch (error) {
            console.error("Error creating post:", error);
        }
        
    };

    useEffect(() => {
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
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="textcontent">Body</label>
                <textarea id="textcontent" value={body} onChange={(e) => setBody(e.target.value)} required/>
            </div>
            <div>
                <label htmlFor="file">Image</label>
                <input id="file" type="file" onChange={handleFileChange}/>
            </div>
            <button type="submit">Create Post</button>
        </form>
    )
}

export default CreatePost
