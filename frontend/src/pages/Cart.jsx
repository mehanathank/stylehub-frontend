import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import { apiUrl } from '../api'

export default function Cart() {
  const { cart, changeQty, removeItem } = useCart()
  const toast = useToast()
  const navigate = useNavigate()
  
  const [promoCode, setPromoCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [promoMessage, setPromoMessage] = useState('')
  const [promoType, setPromoType] = useState('')
  const [coupons, setCoupons] = useState([])
  const [dropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {
    fetch(apiUrl('/api/coupons'))
      .then(r => r.json())
      .then(data => setCoupons(Array.isArray(data) ? data : []))
      .catch(() => {})
  }, [])

  let subtotal = 0
  for (let i = 0; i < cart.length; i++) {
    subtotal = subtotal + (cart[i].price * cart[i].qty)
  }
  
  const total = subtotal - discount

  function applyPromo() {
    const code = promoCode.trim().toUpperCase()
    if (!code) return
    fetch(apiUrl(`/api/coupons/validate/${code}?subtotal=${subtotal}`))
      .then(r => r.json())
      .then(data => {
        if (data.discount !== undefined && data.percent) {
          setDiscount(data.discount)
          setPromoMessage(`Promo applied! ${data.percent}% off — Rs. ${data.discount} saved`)
          setPromoType('success')
          toast('Coupon "' + code + '" applied!')
        } else {
          setDiscount(0)
          setPromoMessage(data.message || 'Promo code not found')
          setPromoType('error')
          toast('Invalid promo code', 'error')
        }
      })
      .catch(() => {
        setDiscount(0)
        setPromoMessage('Failed to validate coupon')
        setPromoType('error')
      })
  }

  function handleCheckout() {
    if (cart.length === 0) { toast('Your cart is empty!', 'error'); return }
    navigate('/checkout', { state: { discount, promoCode: promoCode.trim().toUpperCase() } })
  }
  
  function handleRemove(item) {
    removeItem(item.id, item.size, item.colour)
    toast('Item removed from cart.', 'info')
  }

  return (
    <>
      <Navbar />
      
      <div className="cart-page">
        
        {/* Cart Items */}
        <div className="cart-items">
          <h2 className="cart-title">Your Cart</h2>
          <p className="cart-count">{cart.length} item{cart.length !== 1 ? 's' : ''}</p>
          
          {cart.length === 0 && (
            <p style={{ color: '#8b4513' }}>Your cart is empty.</p>
          )}
          
          {cart.map(item => (
            <div key={item.id + '-' + item.size + '-' + item.colour} className="cart-card">
              
              <img src={item.img} alt={item.name} className="cart-card-img" />
              
              <div className="cart-card-info">
                <h5 className="cart-card-name">{item.name}</h5>
                <p className="cart-card-meta">Size: {item.size} | Colour: {item.colour}</p>
                
                <div className="cart-qty">
                  <button 
                    onClick={() => changeQty(item.id, item.size, item.colour, -1)} 
                    className="qty-btn">
                    -
                  </button>
                  <span>{item.qty}</span>
                  <button 
                    onClick={() => changeQty(item.id, item.size, item.colour, 1)} 
                    className="qty-btn">
                    +
                  </button>
                </div>
              </div>
              
              <div className="cart-card-price">
                <p className="cart-item-total">Rs. {item.price * item.qty}</p>
                <p onClick={() => handleRemove(item)} className="cart-remove">Remove</p>
              </div>
              
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="cart-summary">
          <h4 className="summary-title">Order Summary</h4>
          
          <div className="summary-row">
            <span>Subtotal</span>
            <span>Rs. {subtotal}</span>
          </div>
          
          <div className="summary-row">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          
          <div className="summary-row">
            <span>Discount</span>
            <span>- Rs. {discount}</span>
          </div>
          
          <hr className="summary-hr" />
          
          <div className="summary-row summary-total">
            <strong style={{ color: '#6b3a2a' }}>Total</strong>
            <strong style={{ color: '#6b3a2a' }}>Rs. {total}</strong>
          </div>
          
          <div style={{ position: 'relative', marginBottom: 6 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                value={promoCode}
                onChange={e => setPromoCode(e.target.value)}
                placeholder="Promo code"
                className="promo-input"
                style={{ marginBottom: 0 }}
              />
              <button onClick={() => setDropdownOpen(o => !o)} style={{ background: '#fff', border: '1px solid #e0c9a6', borderRadius: 8, padding: '0 10px', cursor: 'pointer', fontSize: 16, color: '#8b4513', flexShrink: 0 }}>▾</button>
            </div>
            {dropdownOpen && coupons.length > 0 && (
              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid #e0c9a6', borderRadius: 8, zIndex: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', marginTop: 4 }}>
                {coupons.map(c => (
                  <div key={c._id} onClick={() => { setPromoCode(c.code); setDropdownOpen(false) }}
                    style={{ padding: '10px 14px', cursor: 'pointer', borderBottom: '1px solid #f5ece0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#fdf6ee'}
                    onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                    <span style={{ fontWeight: 600, color: '#8b4513', fontSize: 14 }}>{c.code}</span>
                    <span style={{ color: '#888', fontSize: 13 }}>{c.discount}% off</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {promoMessage && (
            <p className={promoType === 'success' ? 'success-msg' : 'error-msg'}>
              {promoMessage}
            </p>
          )}
          
          <button onClick={applyPromo} className="promo-btn">Apply Promo</button>
          <button onClick={handleCheckout} className="checkout-btn">Checkout</button>
        </div>
        
      </div>
      
      <Footer />
    </>
  )
}
