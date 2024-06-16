import styles from '../styles/Navbar.module.css'
import { Link } from 'react-router-dom'

import { getAuth, signOut } from 'firebase/auth'

import useUser from "../hooks/useUser"

const Navbar = () => {

  const { user } = useUser();

  return (
    <div className={styles.nav_section}>
        <div>
            <Link className={styles.title} to={"/"}>Home Page</Link>
        </div>

        {user ? (
          <nav className={styles.navbar}>
              <button className={styles.navlink} type='button' aria-label='Sign Out' onClick={() => {
                signOut(getAuth())
              }}>Sign Out</button>
              <Link to={"/profile"}>Profile</Link>
          </nav>
        ) : (
          <nav className={styles.navbar}>
              <Link className={styles.navlink} to={"/login"}>Log In</Link>
              <Link className={styles.navlink} to={"/create-account"}>Create Account</Link>
          </nav>
        )}
    </div>
  )
}

export default Navbar