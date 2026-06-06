import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { apiUrl } from '../api'

export default function Checkout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { cart, clearCart } = useCart()
  const { user } = useAuth()
  const toast = useToast()
  
  const discount = location.state?.discount || 0
  const promoCode = location.state?.promoCode || ''

  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zip, setZip] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('cod')
  
  const [nameError, setNameError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [addressError, setAddressError] = useState('')
  const [cityError, setCityError] = useState('')
  const [stateError, setStateError] = useState('')
  const [zipError, setZipError] = useState('')

  // Calculate totals
  let subtotal = 0
  for (let i = 0; i < cart.length; i++) {
    subtotal = subtotal + (cart[i].price * cart[i].qty)
  }
  const total = subtotal - discount

  async function placeOrder() {
    if (cart.length === 0) {
      toast('Your cart is empty!', 'error')
      return
    }
    
    // Clear errors
    setNameError('')
    setEmailError('')
    setPhoneError('')
    setAddressError('')
    setCityError('')
    setStateError('')
    setZipError('')
    
    let isValid = true
    
    // Validate name
    if (name.trim().length < 3) {
      setNameError('Full name required')
      isValid = false
    }
    
    // Validate email
    if (!email.includes('@') || !email.includes('.')) {
      setEmailError('Valid email required')
      isValid = false
    }
    
    // Validate phone
    if (phone.length < 10 || phone.length > 11) {
      setPhoneError('Valid phone required')
      isValid = false
    }
    
    // Validate address
    if (address.trim().length < 5) {
      setAddressError('Address required')
      isValid = false
    }
    
    // Validate city
    if (city.trim().length < 2) {
      setCityError('City required')
      isValid = false
    }
    
    // Validate state
    if (state.trim().length < 2) {
      setStateError('State required')
      isValid = false
    }
    
    // Validate zip
    if (zip.trim().length < 4) {
      setZipError('ZIP required')
      isValid = false
    }
    
    if (!isValid) return

    const order = {
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      items: cart,
      subtotal,
      discount,
      promoCode,
      total,
      address: { name, email, phone, address, city, state, zip, payment: paymentMethod },
      status: 'Pending',
      createdAt: new Date().toISOString()
    }

    try {
      const res = await fetch(apiUrl('/api/orders'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      })
      const data = await res.json()
      if (!res.ok) { toast(data.message || 'Failed to place order', 'error'); return }
      clearCart()
      toast('Order placed successfully!')
      navigate('/order-success', { state: { orderId: data.data._id, total } })
    } catch {
      toast('Server error. Try again.', 'error')
    }
  }

  return (
    <>
      <Navbar />
      
      <div style={{ padding: '40px 60px' }}>
        <h2 style={{ fontFamily: 'Playfair Display,serif', color: '#6b3a2a', marginBottom: 32 }}>
          Checkout
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 40, alignItems: 'start' }}>
          
          {/* Left Side - Forms */}
          <div>
            
            {/* Shipping Address */}
            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e0c9a6', padding: 28, marginBottom: 24 }}>
              <h4 style={{ color: '#6b3a2a', marginBottom: 20, fontFamily: 'Playfair Display,serif' }}>
                Shipping Address
              </h4>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={e => setName(e.target.value)}
                    placeholder="Your name"
                    className={nameError ? 'form-input error-border' : 'form-input'}
                  />
                  {nameError && <p className="error-msg">{nameError}</p>}
                </div>
                
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input 
                    type="text" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Email address"
                    className={emailError ? 'form-input error-border' : 'form-input'}
                  />
                  {emailError && <p className="error-msg">{emailError}</p>}
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input 
                    type="tel" 
                    value={phone} 
                    onChange={e => setPhone(e.target.value)}
                    placeholder="Phone number"
                    className={phoneError ? 'form-input error-border' : 'form-input'}
                  />
                  {phoneError && <p className="error-msg">{phoneError}</p>}
                </div>
                
                <div className="form-group">
                  <label className="form-label">ZIP Code</label>
                  <input 
                    type="text" 
                    value={zip} 
                    onChange={e => setZip(e.target.value)}
                    placeholder="ZIP"
                    className={zipError ? 'form-input error-border' : 'form-input'}
                  />
                  {zipError && <p className="error-msg">{zipError}</p>}
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input 
                    type="text" 
                    value={city} 
                    onChange={e => setCity(e.target.value)}
                    placeholder="City"
                    className={cityError ? 'form-input error-border' : 'form-input'}
                  />
                  {cityError && <p className="error-msg">{cityError}</p>}
                </div>
                
                <div className="form-group">
                  <label className="form-label">State</label>
                  <input 
                    type="text" 
                    value={state} 
                    onChange={e => setState(e.target.value)}
                    placeholder="State"
                    className={stateError ? 'form-input error-border' : 'form-input'}
                  />
                  {stateError && <p className="error-msg">{stateError}</p>}
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Full Address</label>
                <textarea 
                  value={address} 
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Street address, apartment, suite, etc." 
                  rows={3}
                  className={addressError ? 'form-input error-border' : 'form-input'}
                  style={{ resize: 'vertical' }}
                />
                {addressError && <p className="error-msg">{addressError}</p>}
              </div>
            </div>

            {/* Payment Method */}
            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e0c9a6', padding: 28 }}>
              <h4 style={{ color: '#6b3a2a', marginBottom: 20, fontFamily: 'Playfair Display,serif' }}>
                Payment Method
              </h4>
              
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, cursor: 'pointer', color: '#6b3a2a', fontSize: 14 }}>
                <input 
                  type="radio" 
                  name="payment" 
                  value="cod" 
                  checked={paymentMethod === 'cod'} 
                  onChange={e => setPaymentMethod(e.target.value)} 
                />
                💵 Cash on Delivery
              </label>
              
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, cursor: 'pointer', color: '#6b3a2a', fontSize: 14 }}>
                <input 
                  type="radio" 
                  name="payment" 
                  value="card" 
                  checked={paymentMethod === 'card'} 
                  onChange={e => setPaymentMethod(e.target.value)} 
                />
                💳 Credit / Debit Card (Demo)
              </label>
            </div>
          </div>

          {/* Right Side - Order Summary */}
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e0c9a6', padding: 24, position: 'sticky', top: 80 }}>
            <h4 className="summary-title">Order Summary</h4>
            
            {cart.map(item => (
              <div 
                key={item.id + '-' + item.size + '-' + item.colour} 
                style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#6b3a2a', marginBottom: 8 }}>
                <span>{item.name} × {item.qty}</span>
                <span>Rs. {item.price * item.qty}</span>
              </div>
            ))}
            
            <hr className="summary-hr" />
            
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
            
            <div className="summary-row" style={{ marginBottom: 20 }}>
              <strong style={{ color: '#6b3a2a' }}>Total</strong>
              <strong style={{ color: '#8b4513', fontSize: 18 }}>Rs. {total}</strong>
            </div>
            
            <button onClick={placeOrder} className="checkout-btn">Place Order</button>
          </div>
          
        </div>
      </div>
      
      <Footer />
    </>
  )
}
