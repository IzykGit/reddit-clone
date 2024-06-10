import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'



const DeleteFunc = ({ id, imageId }: { id: string | undefined, imageId: string | undefined }) => {

    const navigate = useNavigate()

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
        if(id) {
            try {
                console.log("Sending delete request")

                await axios.delete(`http://localhost:5000/post/${id}/${imageId}`)
                console.log("Finished")
                setCompleted(true)

            }
            catch (error) {
                console.log(error)
            }
        }
    }




    return (
        <div>
            <button type='button' onClick={() => {
                deletePost();
            }}>Delete</button>
        </div>
    )
}

export default DeleteFunc