import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useToast } from '../context/ToastContext'

export default function Contact() {
  const toast = useToast()
  
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  
  const [nameError, setNameError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [subjectError, setSubjectError] = useState('')
  const [messageError, setMessageError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    
    // Reset errors
    setNameError('')
    setEmailError('')
    setSubjectError('')
    setMessageError('')
    
    let isValid = true
    
    // Validate name
    if (name.trim().length < 3) {
      setNameError('Name must be at least 3 characters')
      isValid = false
    }
    
    // Validate email
    if (!email.includes('@') || !email.includes('.')) {
      setEmailError('Enter a valid email address')
      isValid = false
    }
    
    // Validate subject
    if (subject.trim().length < 3) {
      setSubjectError('Subject is required')
      isValid = false
    }
    
    // Validate message
    if (message.trim().length < 10) {
      setMessageError('Message must be at least 10 characters')
      isValid = false
    }
    
    if (!isValid) return
    
    // Success
    toast('Your message has been sent! We\'ll get back to you soon.')
    setName('')
    setEmail('')
    setSubject('')
    setMessage('')
  }

  return (
    <>
      <Navbar />
      
      <div className="hero about-hero" style={{ minHeight: 340, backgroundImage: "linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5)),url('/image/home/homeback.jpg')" }}>
        <div className="hero-content">
          <span className="hero-badge">GET IN TOUCH</span>
          <h1 className="hero-title" style={{ fontSize: 52 }}>Contact Us</h1>
          <p className="hero-sub">We'd love to hear from you. Send us a message!</p>
        </div>
      </div>

      <section className="section-pad">
        
        {/* Contact Info Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 24, marginBottom: 60 }}>
          
          <div style={{ background: '#f0dfc0', borderRadius: 12, padding: 24, textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>📍</div>
            <h6 style={{ color: '#6b3a2a', fontWeight: 600, marginBottom: 6 }}>Address</h6>
            <p style={{ color: '#7a5c3a', fontSize: 14 }}>KK Nagar, Coimbatore</p>
          </div>
          
          <div style={{ background: '#f0dfc0', borderRadius: 12, padding: 24, textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>📞</div>
            <h6 style={{ color: '#6b3a2a', fontWeight: 600, marginBottom: 6 }}>Phone</h6>
            <p style={{ color: '#7a5c3a', fontSize: 14 }}>+91 9360553112</p>
          </div>
          
          <div style={{ background: '#f0dfc0', borderRadius: 12, padding: 24, textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>✉️</div>
            <h6 style={{ color: '#6b3a2a', fontWeight: 600, marginBottom: 6 }}>Email</h6>
            <p style={{ color: '#7a5c3a', fontSize: 14 }}>stylehub@gmail.com</p>
          </div>
          
          <div style={{ background: '#f0dfc0', borderRadius: 12, padding: 24, textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>🕐</div>
            <h6 style={{ color: '#6b3a2a', fontWeight: 600, marginBottom: 6 }}>Hours</h6>
            <p style={{ color: '#7a5c3a', fontSize: 14 }}>Mon–Fri: 9 AM – 6 PM</p>
          </div>
          
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'start' }}>
          
          {/* Contact Form */}
          <div>
            <p className="section-title">CONTACT FORM</p>
            <h2 className="section-heading" style={{ textAlign: 'left' }}>Send Us a Message</h2>
            
            <form onSubmit={handleSubmit}>
              
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
                  placeholder="Your email"
                  className={emailError ? 'form-input error-border' : 'form-input'} 
                />
                {emailError && <p className="error-msg">{emailError}</p>}
              </div>
              
              <div className="form-group">
                <label className="form-label">Subject</label>
                <input 
                  type="text" 
                  value={subject} 
                  onChange={e => setSubject(e.target.value)}
                  placeholder="Subject"
                  className={subjectError ? 'form-input error-border' : 'form-input'} 
                />
                {subjectError && <p className="error-msg">{subjectError}</p>}
              </div>
              
              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea 
                  value={message} 
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Write your message..." 
                  rows={5}
                  className={messageError ? 'form-input error-border' : 'form-input'}
                  style={{ resize: 'vertical' }} 
                />
                {messageError && <p className="error-msg">{messageError}</p>}
              </div>
              
              <button type="submit" className="btn-primary">Send Message</button>
              
            </form>
          </div>
          
          {/* Why Contact Us */}
          <div style={{ background: '#f0dfc0', borderRadius: 14, padding: 32 }}>
            <h3 style={{ fontFamily: 'Playfair Display,serif', color: '#6b3a2a', marginBottom: 16 }}>Why Contact Us?</h3>
            
            <p style={{ color: '#7a5c3a', fontSize: 14, padding: '8px 0', borderBottom: '1px solid #e0c9a6', margin: 0 }}>
              ✓ Order inquiries and tracking
            </p>
            <p style={{ color: '#7a5c3a', fontSize: 14, padding: '8px 0', borderBottom: '1px solid #e0c9a6', margin: 0 }}>
              ✓ Returns & exchange assistance
            </p>
            <p style={{ color: '#7a5c3a', fontSize: 14, padding: '8px 0', borderBottom: '1px solid #e0c9a6', margin: 0 }}>
              ✓ Product information & sizing
            </p>
            <p style={{ color: '#7a5c3a', fontSize: 14, padding: '8px 0', borderBottom: '1px solid #e0c9a6', margin: 0 }}>
              ✓ Wholesale and bulk orders
            </p>
            <p style={{ color: '#7a5c3a', fontSize: 14, padding: '8px 0', borderBottom: '1px solid #e0c9a6', margin: 0 }}>
              ✓ Partnership opportunities
            </p>
            <p style={{ color: '#7a5c3a', fontSize: 14, padding: '8px 0', borderBottom: '1px solid #e0c9a6', margin: 0 }}>
              ✓ General feedback
            </p>
            
            <p style={{ color: '#7a5c3a', fontSize: 14, marginTop: 20, lineHeight: 1.8 }}>
              Our customer support team typically responds within <strong>24 hours</strong> on business days.
            </p>
          </div>
          
        </div>
      </section>
      
      <Footer />
    </>
  )
}
