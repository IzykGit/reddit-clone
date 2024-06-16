import { useEffect, useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom"

import useUser from "../hooks/useUser"


const LikeHandler = ({ postId, postLikes, likedIds }: { postId: string, postLikes: number, likedIds: string[] }) => {

    const { user, isLoading } = useUser();


    const [likes, setLikes] = useState(0);
    



    useEffect(() => {
        setLikes(postLikes)
    }, [postLikes, setLikes])
    

    const [alreadyLiked, setAlreadyLiked] = useState<boolean>(() => user ? likedIds.includes(user.uid) : false);
    const [clicked, setClicked] = useState(false);

    const [disableButton, setDisableButton] = useState(false)

    useEffect(() => {
        if (user && Array.isArray(likedIds)) {
            setAlreadyLiked(likedIds.includes(user.uid));
        }
    }, [user, likedIds]);

    const handleLikeUnlike = async () => {

        if (!user) return



        setDisableButton(true)
        const token = user && await user.getIdToken();
        const headers = { Authorization: `Bearer ${token}` };
        
        if (postId) {
            try {


                if (alreadyLiked) {
                    const response = await axios({
                        method: "PUT",
                        url: `http://localhost:5000/api/${postId}/unlike`,
                        headers: headers
                    });

                    console.log('post unliked');
                    setLikes(response.data.likes);

                    console.log("Updated post:", response)
                    setAlreadyLiked(false);
                    setDisableButton(false)

                } else {

                    const response = await axios({
                        method: "PUT",
                        url: `http://localhost:5000/api/${postId}/like`,
                        data: null,
                        headers: headers
                    });
                    
                    console.log('post liked');

                    setLikes(response.data.likes);
                    console.log("Updated post:", response)
                    setAlreadyLiked(true);
                    setDisableButton(false)
                }
            } catch (error) {
                console.log(error);
            }
        }
    };


    useEffect(() => {
        if (clicked) {
            handleLikeUnlike().finally(() => setClicked(false));
        }
    }, [clicked]);

    return (
        <>
        <div>
            {/* checking to see if likes is greater than one */}
            <p>{likes === 0 ? "No Likes" : likes}</p>
        </div>
        {user ? (
            <div>
                {/* determining if user can like post or unlike post */}
                <button disabled={disableButton} type="button" onClick={() => setClicked(true)}>
                    {alreadyLiked ? "Unlike" : "Like"}
                </button>
            </div>
        ) : (
            <div>
                {/* if user it not logged in they will be asked to log in */}
                <Link to={"/login"}>Log in to like post</Link>
            </div>
        )
        }
        </>
    )
}

export default LikeHandler