import { useState, useEffect } from "react"
import axios from "axios"

import useUser from "../hooks/useUser"

import styles from '../styles/Notifications.module.css'



// data interface 
interface Notifications {
    _id: string,
    body: string,
    likeNamesCount: number,
    likeNames: [string]
}

const Notifications = () => {

    const { user } = useUser();

    const [notifiers, setNotifiers] = useState<Notifications[]>([])

    const [loading, setLoading] = useState(true)

    const fetchNotifications = async () => {

        if(!user) {
            console.log("No User")
            return
        }
        console.log("user")

        try {
            const token = await user!.getIdToken();
            const headers = token ? { Authorization: `Bearer ${token}` } : {}
            const response = await axios({
                method: "GET",
                url: `http://localhost:5000/api/user-notifications`,
                headers: headers
            })

            console.log(response.data)
            setNotifiers(response.data)
            setLoading(false)
            console.log(notifiers)
        }
        catch (error) {
            console.log(error)
        }
        
    }

    useEffect(() => {
        fetchNotifications()
        console.log("this has been triggered")
    }, [user])

    return (
        <main className={styles.noti_main}>
            <p className={styles.loading}>{loading ? "Loading..." : ""}</p>
            {notifiers.length === 0 && !loading ? (
                <p className={styles.error}>You have no notifications</p>
            ) : (
                notifiers.map(notifier => (
                    <div key={notifier._id} className={styles.notification_container}>

                        {notifier.likeNamesCount < 3 ? (
                            <p>{notifier.likeNames.join(', ')} has liked your post!</p>
                        ) : (
                            <p>{notifier.likeNames.join(', ')}, and {notifier.likeNamesCount - 2 } others have, liked your post!</p>
                        )}
                        <p>{notifier.body.split(" ").slice(0, 12).join(" ")}...</p>
                    </div>
                ))
            )}
        </main>
    )
}

export default Notifications