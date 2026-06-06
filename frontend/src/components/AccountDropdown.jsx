import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiUser, FiPackage, FiHeart, FiLogOut, FiSettings, FiChevronDown, FiLogIn } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import styles from './AccountDropdown.module.css'

export default function AccountDropdown() {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const { user, logout } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleLogout() {
    logout()
    setOpen(false)
    toast('Logged out successfully.', 'info')
    navigate('/')
  }

  const userItems = [
    { icon: <FiUser />, label: 'My Profile', to: '/profile' },
    { icon: <FiPackage />, label: 'My Orders', to: '/orders' },
    { icon: <FiHeart />, label: 'Wishlist', to: '/wishlist' },
  ]

  return (
    <div className={styles.wrapper} ref={ref}>
      <button className={styles.trigger} onClick={() => setOpen(o => !o)}>
        <FiUser className={styles.triggerIcon} />
        <span>{user.name.split(' ')[0]}</span>
      </button>

      {open && (
        <div className={styles.dropdown}>
          {user ? (
            <>
              <p className={styles.title}>{user.name}</p>
              <ul className={styles.menu}>
                {userItems.map(({ icon, label, to }) => (
                  <li key={label} className={styles.item} onClick={() => setOpen(false)}>
                    <span className={styles.itemIcon}>{icon}</span>
                    <Link to={to} style={{ textDecoration: 'none', color: 'inherit' }}>{label}</Link>
                  </li>
                ))}
                {user.role === 'admin' && (
                  <li className={styles.item} onClick={() => setOpen(false)}>
                    <span className={styles.itemIcon}><FiSettings /></span>
                    <Link to="/admin" style={{ textDecoration: 'none', color: 'inherit' }}>Admin Panel</Link>
                  </li>
                )}
                <li className={styles.item} onClick={handleLogout} style={{ borderTop: '1px solid #f0f0f0', marginTop: 4, paddingTop: 12 }}>
                  <span className={styles.itemIcon}><FiLogOut /></span>
                  <span>Logout</span>
                </li>
              </ul>
            </>
          ) : (
            <>
              <p className={styles.title}>Your Account</p>
              <ul className={styles.menu}>
                <li className={styles.item} onClick={() => setOpen(false)}>
                  <span className={styles.itemIcon}><FiLogIn /></span>
                  <Link to="/login" style={{ textDecoration: 'none', color: 'inherit' }}>Login</Link>
                </li>
                <li className={styles.item} onClick={() => setOpen(false)}>
                  <span className={styles.itemIcon}><FiUser /></span>
                  <Link to="/signup" style={{ textDecoration: 'none', color: 'inherit' }}>Sign Up</Link>
                </li>
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  )
}
