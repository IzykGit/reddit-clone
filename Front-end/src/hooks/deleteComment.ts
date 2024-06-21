import axios from "axios"

const deleteComment = async ( { commentId, postId, refreshComments }: { commentId: string, postId: string, refreshComments: VoidFunction } ) => {
    console.log(commentId)
    console.log(postId)


    try {
        const response = await axios({
            method: "DELETE",
            url: `http://localhost:5000/api/${postId}/${commentId}/comment/delete`,
        })

        console.log(response.data)
        refreshComments()
    }
    catch (error) {
        console.log("Could not delete comment", error)
    }
}

export default deleteComment