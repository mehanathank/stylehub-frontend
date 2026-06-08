import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiUser, FiShoppingCart, FiHeart } from 'react-icons/fi'
import AccountDropdown from './AccountDropdown'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

  function handleWishlist(e) {
    e.preventDefault()
    if (!user) navigate('/login?redirect=/wishlist')
    else navigate('/wishlist')
  }

  function handleCart(e) {
    e.preventDefault()
    if (!user) navigate('/login?redirect=/cart')
    else navigate('/cart')
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">StyleHub</Link>

      <ul className={`nav-links${open ? ' nav-open' : ''}`}>
        {[['/', 'Home'], ['/products', 'Shop'], ['/about', 'About'], ['/faq', 'FAQ'], ['/contact', 'Contact']].map(([to, label]) => (
          <li key={label} onClick={() => setOpen(false)}><Link to={to}>{label}</Link></li>
        ))}
      </ul>

      {/* Always visible on all screen sizes */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span onClick={() => setOpen(false)}>
          {user ? <AccountDropdown /> : <Link to="/login" className="nav-icon-btn" style={{ display: 'flex', alignItems: 'center', gap: 4 }}><FiUser size={22} /><span style={{ fontSize: 14 }}>Login</span></Link>}
        </span>
        <Link to="/wishlist" className="nav-icon-btn" onClick={handleWishlist}><FiHeart size={22} /></Link>
        <Link to="/cart" className="nav-icon-btn nav-cart-btn" onClick={handleCart}><FiShoppingCart size={20} /></Link>
        <button className="nav-hamburger" onClick={() => setOpen(o => !o)} aria-label="Menu">☰</button>
      </div>
    </nav>
  )
}
