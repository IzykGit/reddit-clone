import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";


const CreatePost = () => {

    // setting data for post body
    const [body, setBody] = useState("");

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();


        try {

            // creating post
            const response = await axios.post("http://localhost:5000/post", {
            user: undefined,
            imageId: undefined,
            body,
            comments: [],
            date: new Date,
            likes: 0,
            });
            console.log("Post created:", response.data);

            setBody("")
            window.location.reload()
        } catch (error) {
            console.error("Error creating post:", error);
        }
        
    };

    
    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="textcontent">Body</label>
                <textarea id="textcontent" value={body} onChange={(e) => setBody(e.target.value)} required/>
            </div>
            <button type="submit">Create Post</button>
        </form>
    )
}

export default CreatePost
