import { useState } from "react"
import { Link, useNavigate } from "react-router-dom";

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import Navbar from "../components/Navbar";

const LoginPage = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");

    const navigate = useNavigate();

    const logIn = async (event: React.ChangeEvent<HTMLFormElement>) => {
        event.preventDefault()

        try {
            await signInWithEmailAndPassword(getAuth(), email, password)
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
        <h1>Log In</h1>
        {error && <p>{error}</p>}

        <form onSubmit={logIn}>
            <label htmlFor="email">Email:</label>
            <input type="email" id="email"
            placeholder="example@gmail.com" value={email}
            autoComplete="email"
            onChange={e => setEmail(e.target.value)}/>

            <label htmlFor="password">Password</label>
            <input type="password" id="password"
            placeholder="" value={password} autoComplete="current-password"
            onChange={e => setPassword(e.target.value)}/>

            <button type="submit" >login</button>
        </form>

        <Link to="/create-account">Don't have an account?</Link> 
        </>
    )
}

export default LoginPage