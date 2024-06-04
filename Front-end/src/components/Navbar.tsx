import styles from '../styles/Navbar.module.css'

const Navbar = () => {
  return (
    <div className={styles.nav_section}>
        <div className={styles.title}>
            <p>Placeholder</p>
        </div>
        <nav className={styles.navbar}>
            <a>Profile</a>
            <a>Profile</a>
            <a>Profile</a>
            <a>Profile</a>
        </nav>
    </div>
  )
}

export default Navbar