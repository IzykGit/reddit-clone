import { useState } from "react"
import { Link, useNavigate } from 'react-router-dom'
import Navbar from "../components/Navbar";

import axios from "axios";

import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const CreateAccountPage = () => {

    const [userName, setUserName] = useState("")
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState("");

    const navigate = useNavigate();


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(""); 
 

        try {
            // validate password match
            if (password !== confirmPassword) {
                setError("Passwords do not match");
                return;
            }

            // check if the username exists
            const userDetailsCheckResponse = await axios.get(`http://localhost:5000/api/user-check/${userName}`);
            if (userDetailsCheckResponse.data.exists) {
                setError("Username or Email already exists!");
                return;
            }

            // create the user account with firebase
            const userCredential = await createUserWithEmailAndPassword(getAuth(), email, password);
            const user = userCredential.user;
            const uid = user.uid;

            // Prepare user data to send to the backend
            const userData = {
                userName: userName,
                userId: uid,
                userEmail: email,
                date: new Date().toISOString()
            };

            // save the user in mongodb 'users' collection
            const response = await axios.post("http://localhost:5000/api/create-user", userData, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            console.log(response.data);

            // navigate to the home page after successful creation
            navigate("/");
        } catch (error) {
            console.error('Error creating account:', error);
            setError("An error occurred while creating your account. Please try again.");
        }
    };


    return (
        <>
        <Navbar />
        <h1>Create Account</h1>
        {error && <p>{error}</p>}

        <form onSubmit={handleSubmit}>
            <label htmlFor="username">Username</label>
            <input type="text" id="username" value={userName}
            onChange={e => setUserName(e.target.value)}/>
            
            <label htmlFor="email">Email:</label>
            <input type="email" id="email"
            placeholder="example@gmail.com" value={email}
            onChange={e => setEmail(e.target.value)}/>

            <label htmlFor="password">Password</label>
            <input type="password" id="password"
            placeholder=""value={password}
            onChange={e => setPassword(e.target.value)}/>

            <label htmlFor="confirmpassword">ConfirmPassword</label>
            <input type="password" id="confirmpassword"
            placeholder="" value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}/>

            <button type="submit">Create Account</button>
        </form>

        <Link to="/login">Have an account?</Link> 
        </>
    )
}

export default CreateAccountPage