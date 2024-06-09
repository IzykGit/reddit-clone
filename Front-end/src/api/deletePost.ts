import axios from 'axios'



const DeleteButton = async ({ id, imageId }: { id: string, imageId: string }) => {

    if(id) {
        try {
            await axios.delete(`http://localhost:5000/post/${id}/${imageId}`)
            console.log("post deleted")
        }
        catch (error) {
            console.log(error)
        }
    

    }

    
}

export default DeleteButton