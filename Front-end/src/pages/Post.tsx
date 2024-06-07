import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";


const Post = () => {

    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");


    const navigate = useNavigate()

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();


        try {

            const response = await axios.post("http://localhost:5000/post", {
            title,
            body,
            comments: [],
            date: new Date()
            });
            console.log("Post created:", response.data);
            navigate("/")
        } catch (error) {
            console.error("Error creating post:", error);
        }
        
    };

    
    return (
        <>
        <Navbar />
        <main>
        <form onSubmit={handleSubmit}>
            <div>
            <label htmlFor="title">Title</label>
            <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div>
            <label htmlFor="textcontent">Body</label>
            <textarea id="textcontent" value={body} onChange={(e) => setBody(e.target.value)} />
            </div>
            <button type="submit">Create Post</button>
        </form>
        </main>
    </>
    )
}

export default Post
