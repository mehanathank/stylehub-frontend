import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'

export default function Home() {
  const { user } = useAuth()
  const navigate = useNavigate()

  // if user is not logged in, go to login page
  function handleClick(e, to) {
    e.preventDefault()
    if (!user) {
      navigate('/login')
    } else {
      navigate(to)
    }
  }

  return (
    <>
      <Navbar />

      {/* Hero */}
      <div className="hero">
        <div className="hero-content">
          <div className="hero-badge">NEW COLLECTION 2025</div>
          <h1 className="hero-title">Elevate Your<br />Everyday Style</h1>
          <p className="hero-sub">Discover the latest trends in fashion.<br />Timeless pieces, modern designs, just for you.</p>
          <div className="hero-btns">
            <a href="/products" onClick={e => handleClick(e, '/products')} className="btn-primary">Shop Now</a>
            <Link to="/about" className="btn-outline">Our Story</Link>
          </div>
        </div>
      </div>

      {/* Features Strip */}
      <div className="features-strip">
        <div className="feature-item"><span>🚚</span>Free Shipping on orders over Rs. 999</div>
        <div className="feature-item"><span>↩️</span>Easy 30-Day Returns</div>
        <div className="feature-item"><span>💎</span>100% Authentic Products</div>
        <div className="feature-item"><span>🔒</span>Secure Payments</div>
      </div>

      {/* Shop by Category */}
      <div className="section-pad">
        <p className="section-title">BROWSE</p>
        <h2 className="section-heading">Shop by Category</h2>
        <div className="grid-4">

          <a href="/products" onClick={e => handleClick(e, '/products')} className="cat-card">
            <img src="/image/home/men.png" alt="Men" className="cat-img" />
            <div className="cat-overlay">
              <h5 className="cat-name">Men</h5>
              <p className="cat-sub">Explore collection →</p>
            </div>
          </a>

          <a href="/products" onClick={e => handleClick(e, '/products')} className="cat-card">
            <img src="/image/home/woman.png" alt="Women" className="cat-img" />
            <div className="cat-overlay">
              <h5 className="cat-name">Women</h5>
              <p className="cat-sub">Explore collection →</p>
            </div>
          </a>

          <a href="/products" onClick={e => handleClick(e, '/products')} className="cat-card">
            <img src="/image/home/kids.png" alt="Kids" className="cat-img" />
            <div className="cat-overlay">
              <h5 className="cat-name">Kids</h5>
              <p className="cat-sub">Explore collection →</p>
            </div>
          </a>

          <a href="/products" onClick={e => handleClick(e, '/products')} className="cat-card">
            <img src="/image/home/baby.png" alt="Baby" className="cat-img" />
            <div className="cat-overlay">
              <h5 className="cat-name">Baby</h5>
              <p className="cat-sub">Explore collection →</p>
            </div>
          </a>

        </div>
      </div>

      {/* Promo Banner */}
      <div className="section-pad">
        <div className="promo-banner">
          <p className="promo-label">LIMITED TIME</p>
          <h2 className="promo-title">Up to 50% Off<br />Sale Collection</h2>
          <p className="promo-sub">Don't miss out on our biggest sale of the season.</p>
          <a href="/products" onClick={e => handleClick(e, '/products')} className="promo-cta">Shop the Sale</a>
        </div>
      </div>

      {/* Testimonials */}
      <div className="section-pad bg-white">
        <p className="section-title">WHAT THEY SAY</p>
        <h2 className="section-heading">Customer Reviews</h2>
        <div className="grid-3">

          <div className="review-card">
            <div className="review-stars">★★★★★</div>
            <p className="review-text">"Amazing quality and fast delivery. StyleHub is my go-to for fashion. Highly recommend!"</p>
            <h6 className="review-name">— Sara A.</h6>
          </div>

          <div className="review-card">
            <div className="review-stars">★★★★★</div>
            <p className="review-text">"Love the kids collection! Great fabric, perfect sizing, and the prices are unbeatable."</p>
            <h6 className="review-name">— Omar K.</h6>
          </div>

          <div className="review-card">
            <div className="review-stars">★★★★★</div>
            <p className="review-text">"Ordered twice already. The men's jacket is exactly as shown. Will definitely order again."</p>
            <h6 className="review-name">— Yusuf M.</h6>
          </div>

        </div>
      </div>

      <Footer />
    </>
  )
}
