import styles from './Footer.module.css'

const today = new Date()

const Footer = () => {
  return (
    <footer className={`${styles.footer} bg-pink`}>
      <div className={styles.inner}>
        &copy; {today.getFullYear()} Anthony Lombardi. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer
