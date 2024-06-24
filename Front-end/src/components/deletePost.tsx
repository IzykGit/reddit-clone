import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import useUser from '../hooks/useUser'


const DeleteFunc = ({ postId, imageId, refreshPosts }: { postId: string | undefined, imageId: string | undefined, refreshPosts: VoidFunction }) => {

    const navigate = useNavigate()

    const { user } = useUser();


    const [completed, setCompleted] = useState(false)

    const [disabled, setDisabled] = useState(false)

    useEffect(() => {
        if(completed) {
            if(window.location.pathname !== "/") {
                console.log("Navigating to home page")
                navigate("/")
            }
            else {
                refreshPosts()
            }
        }
        else {
            return
        }
    }, [completed, navigate, refreshPosts])

    const deletePost = async () => {
        setDisabled(true)

        if(postId) {
            try {
                console.log("Sending delete request")

                await axios({
                    method: "DELETE",
                    url: `http://localhost:5000/api/post/${postId}/${imageId}`
                })
                
                console.log("Finished")
                setCompleted(true)
                setDisabled(false)
            }
            catch (error) {
                console.log(error)
            }
        }
    }




    return (
        <>
        {user ? (
            <div>
                <button disabled={disabled} type='button' onClick={() => {
                    deletePost();
                }}>Delete</button>
            </div>
        ) : (
            <div></div>
        )}
        </>
    )
}

export default DeleteFunc