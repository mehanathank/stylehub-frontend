import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const toast = useToast()
  const redirect = new URLSearchParams(location.search).get('redirect') || '/'
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [loading, setLoading] = useState(false)

  // Show success message from password reset
  useEffect(() => {
    if (location.state?.message) {
      toast(location.state.message, location.state.type || 'success')
      // Clear the state to prevent showing message on refresh
      window.history.replaceState({}, document.title)
    }
  }, [location.state, toast])

  async function handleSubmit(e) {
    e.preventDefault()
    
    setEmailError('')
    setPasswordError('')
    
    let isValid = true
    
    if (!email.includes('@') || !email.includes('.')) {
      setEmailError('Please enter a valid email address')
      isValid = false
    }
    
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters')
      isValid = false
    }
    
    if (!isValid) return
    
    setLoading(true)
    const result = await login(email, password, rememberMe)
    setLoading(false)
    
    if (result.ok) {
      toast('Login successful! Welcome back.')
      navigate(redirect)
    } else {
      setPasswordError(result.msg)
    }
  }

  return (
    <>
      <Navbar />
      
      <div className="auth-bg">
        <div className="auth-card">
          <h1 className="auth-brand">StyleHub</h1>
          <p className="auth-sub">Login to your account</p>
          
          <form onSubmit={handleSubmit}>
            
            <div className="form-group">
              <label className="form-label">Email</label>
              <input 
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
                placeholder="Enter your password"
                className={passwordError ? 'form-input error-border' : 'form-input'}
              />
              {passwordError && <p className="error-msg">{passwordError}</p>}
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <label style={{ fontSize: 14, color: '#6b3a2a', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={rememberMe} 
                  onChange={e => setRememberMe(e.target.checked)} 
                />
                Remember me
              </label>
              <Link to="/forgot" className="auth-link">Forgot password?</Link>
            </div>
            
            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? 'Please wait, server is waking up...' : 'Login'}
            </button>
            
          </form>
          
          <p className="auth-footer">
            Don't have an account? <Link to="/signup" className="auth-link">Sign Up</Link>
          </p>
        </div>
      </div>
    </>
  )
}
