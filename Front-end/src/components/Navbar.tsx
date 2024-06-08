import styles from '../styles/Navbar.module.css'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <div className={styles.nav_section}>
        <div>
            <Link className={styles.title} to={"/"}>Placeholder</Link>
        </div>
        <nav className={styles.navbar}>
            <a>Profile</a>
            <a>Profile</a>
            <a>Profile</a>
        </nav>
    </div>
  )
}

export default Navbar