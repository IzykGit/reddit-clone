import styles from '../styles/Navbar.module.css'
import { Link } from 'react-router-dom'

import useUser from '../hooks/useUser'

const Navbar = () => {

  const { user } = useUser();

  return (
    <div className={styles.nav_section}>
        <div>
            <Link className={styles.title} to={"/"}>Home Page</Link>
        </div>

        {user ? (
          <nav className={styles.navbar}>
              <button type='button' aria-label='Sign out button'>Sign out</button>
          </nav>
        ) : (
          <nav>
              <Link to={"/login"}>Log In</Link>
              <Link to={"/create-account"}>Create Account</Link>
              <a>Profile</a>
          </nav>
        )}
    </div>
  )
}

export default Navbar