import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function Signup() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const toast = useToast()
  
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  const [nameError, setNameError] = useState('')
  const [mobileError, setMobileError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [confirmError, setConfirmError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    
    setNameError('')
    setMobileError('')
    setEmailError('')
    setPasswordError('')
    setConfirmError('')
    
    let isValid = true
    
    if (name.trim().length < 3) {
      setNameError('Name must be at least 3 letters')
      isValid = false
    }
    
    if (mobile.length < 10 || mobile.length > 11) {
      setMobileError('Enter a valid 10-11 digit mobile number')
      isValid = false
    }
    
    if (!email.includes('@') || !email.includes('.')) {
      setEmailError('Please enter a valid email address')
      isValid = false
    }
    
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters')
      isValid = false
    }
    
    if (confirmPassword !== password) {
      setConfirmError('Passwords do not match')
      isValid = false
    }
    
    if (!isValid) return
    
    const result = await register({ name, mobile, email, password })
    
    if (result.ok) {
      toast('Account created successfully! Welcome to StyleHub.')
      navigate('/')
    } else {
      setEmailError(result.msg)
    }
  }

  return (
    <>
      <div className="auth-bg">
        <div className="auth-card">
          <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8b4513', display: 'flex', alignItems: 'center', gap: 4, fontSize: 14, fontWeight: 600, marginBottom: 16, padding: 0 }}>
            <FiArrowLeft size={18} /> Back
          </button>
          <h1 className="auth-brand">StyleHub</h1>
          <p className="auth-sub">Create your account</p>
          
          <form onSubmit={handleSubmit}>
            
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                placeholder="Enter your name"
                className={nameError ? 'form-input error-border' : 'form-input'}
              />
              {nameError && <p className="error-msg">{nameError}</p>}
            </div>
            
            <div className="form-group">
              <label className="form-label">Mobile Number</label>
              <input 
                type="tel" 
                value={mobile} 
                onChange={e => setMobile(e.target.value)} 
                placeholder="Enter your mobile number"
                className={mobileError ? 'form-input error-border' : 'form-input'}
              />
              {mobileError && <p className="error-msg">{mobileError}</p>}
            </div>
            
            <div className="form-group">
              <label className="form-label">Email</label>
              <input 
                type="text" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                placeholder="Enter your email"
                className={emailError ? 'form-input error-border' : 'form-input'}
              />
              {emailError && <p className="error-msg">{emailError}</p>}
            </div>
            
            <div className="form-group">
              <label className="form-label">Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                placeholder="Create a password"
                className={passwordError ? 'form-input error-border' : 'form-input'}
              />
              {passwordError && <p className="error-msg">{passwordError}</p>}
            </div>
            
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input 
                type="password" 
                value={confirmPassword} 
                onChange={e => setConfirmPassword(e.target.value)} 
                placeholder="Confirm your password"
                className={confirmError ? 'form-input error-border' : 'form-input'}
              />
              {confirmError && <p className="error-msg">{confirmError}</p>}
            </div>
            
            <button type="submit" className="auth-submit">Sign Up</button>
            
          </form>
          
          <p className="auth-footer">
            Already have an account? <Link to="/login" className="auth-link">Login</Link>
          </p>
        </div>
      </div>
    </>
  )
}
