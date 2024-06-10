import axios from 'axios'



const unlikePost = async ({ id, likes }: { id: string, likes: number }) => {

    if(id) {
        try {
            await axios.put(`http://localhost:5000/${id}/unlike`, likes)
            console.log('post unliked')
            
        }
        catch (error) {
            console.log(error)
        }
    }
    
    return 
}

export default unlikePost