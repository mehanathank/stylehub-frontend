import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <div className="footer-brand">StyleHub</div>
          <p>Your one-stop destination for fashion. Timeless pieces, modern designs, for everyone.</p>
        </div>
        <div>
          <h6>Shop</h6>
          <div className="footer-links">
            {['Men', 'Women', 'Kids', 'Baby', 'Sale'].map(c => (
              <Link key={c} to="/products">{c}</Link>
            ))}
          </div>
        </div>
        <div>
          <h6>Company</h6>
          <div className="footer-links">
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/faq">FAQ</Link>
          </div>
        </div>
      </div>
      <hr className="footer-hr" />
      <div className="footer-bottom">© 2025 StyleHub. All rights reserved.</div>
    </footer>
  )
}
