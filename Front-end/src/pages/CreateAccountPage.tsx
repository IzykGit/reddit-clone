import { useState } from "react"
import { Link, useNavigate } from 'react-router-dom'
import Navbar from "../components/Navbar";

import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const CreateAccountPage = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState("");

    const navigate = useNavigate();


    const createAccount = async () => {
        try {
            if (password !== confirmPassword) {
              setError("Passwords do not match");
              return
            }

            await createUserWithEmailAndPassword(getAuth(), email, password);
            navigate("/")
        }
        catch (e) {
            const error = `${e}`
            setError(error)
        }
    }

    return (
        <>
        <Navbar />
        <h1>Create Account</h1>
        {error && <p>{error}</p>}
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

        <button type="button" onClick={createAccount}>Create Account</button>

        <Link to="/login">Have an account?</Link> 
        </>
    )
}

export default CreateAccountPage