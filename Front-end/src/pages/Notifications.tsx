import { useState, useEffect } from "react"
import axios from "axios"

import useUser from "../hooks/useUser"

import styles from '../styles/Notifications.module.css'



const Notifications = () => {

    const { user } = useUser();

    const [notifiers, setNotifiers] = useState([])

    const fetchNotifications = async () => {
            
        try {
            const response = await axios({
                method: "GET",
                url: `http://localhost:5000/api/user-notifications`
            })

            console.log(response.data)
        }
        catch (error) {
            console.log(error)
        }
        
    }

    useEffect(() => {
        fetchNotifications()
    }, [])

    return (
        <main className={styles.noti_main}>
            <p>Placeholder</p>
        </main>
    )
}

export default Notifications