import axios from 'axios'



const likePost = async ({ id, likes }: { id: string, likes: number }) => {

    if(id) {
        try {
            await axios.put(`http://localhost:5000/${id}/like`, likes)
            console.log('post liked')
            
        }
        catch (error) {
            console.log(error)
        }
    }
    
    return 
}

export default likePost