import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import useUser from '../hooks/useUser'


const DeleteFunc = ({ postId, imageId }: { postId: string | undefined, imageId: string | undefined }) => {

    const navigate = useNavigate()

    const { user } = useUser();


    const [completed, setCompleted] = useState(false)

    useEffect(() => {
        if(completed) {
            console.log("Navigating to home page")
            navigate("/")
        }
        else {
            return
        }
    }, [completed, navigate])

    const deletePost = async () => {
        if(postId) {
            try {
                console.log("Sending delete request")

                await axios.delete(`http://localhost:5000/post/${postId}/${imageId}`)
                console.log("Finished")
                setCompleted(true)

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
                <button type='button' onClick={() => {
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