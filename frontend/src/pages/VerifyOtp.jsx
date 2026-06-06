import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { apiUrl } from '../api';

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);

  // Get email from navigation state
  const email = location.state?.email;

  // Redirect if no email provided
  useEffect(() => {
    if (!email) {
      navigate('/forgot');
    }
  }, [email, navigate]);

  // Countdown timer
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const inputStyle = (hasErr = false) => ({
    width: '100%',
    padding: '12px 16px',
    border: `2px solid ${hasErr ? '#e74c3c' : '#e0c9a6'}`,
    background: hasErr ? '#fdf2f2' : '#fdf6ee',
    borderRadius: 8,
    fontSize: 24,
    fontFamily: 'Poppins,sans-serif',
    outline: 'none',
    boxSizing: 'border-box',
    textAlign: 'center',
    letterSpacing: 8,
    fontWeight: 600
  });

  async function handleVerifyOtp(e) {
    e.preventDefault();
    setError('');
    
    if (!otp || otp.length !== 6) {
      setError('Please enter the 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(apiUrl('/api/users/verify-otp'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.message);
        return;
      }
      
      // Navigate to reset password page with email and otp
      navigate('/reset-password', { 
        state: { email, otp, verified: true }
      });
      
    } catch (err) {
      console.error('Verify OTP error:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleResendOtp() {
    if (countdown > 0) return;
    
    setLoading(true);
    try {
      const res = await fetch(apiUrl('/api/users/send-otp'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      if (res.ok) {
        setCountdown(60);
        setOtp('');
        setError('');
      }
    } catch (err) {
      setError('Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  }

  if (!email) {
    return null; // Will redirect via useEffect
  }

  return (
    <>
      <Navbar />
      <div style={{
        minHeight: '90vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: "linear-gradient(rgba(0,0,0,0.4),rgba(0,0,0,0.4)), url('/image/home/back.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '40px 16px'
      }}>
        <div style={{
          background: '#fff',
          borderRadius: 16,
          padding: '40px 50px',
          width: '100%',
          maxWidth: 480,
          borderTop: '4px solid #8b4513',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            color: '#8b4513',
            marginBottom: 8
          }}>
            StyleHub
          </h1>
          
          <h3 style={{ color: '#6b3a2a', marginBottom: 8 }}>Verify OTP</h3>
          <p style={{ color: '#888', marginBottom: 4 }}>
            OTP sent to <strong>{email}</strong>
          </p>
          <p style={{ color: '#999', fontSize: 12, marginBottom: 32 }}>
            Please check your inbox. OTP expires in 10 minutes.
          </p>

          <form onSubmit={handleVerifyOtp}>
            <div style={{ marginBottom: 24 }}>
              <input
                type="text"
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                maxLength={6}
                style={inputStyle(!!error)}
                disabled={loading}
              />
            </div>

            {error && (
              <p style={{ color: '#e74c3c', fontSize: 14, marginBottom: 20 }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              style={{
                width: '100%',
                background: loading || otp.length !== 6 ? '#bdc3c7' : '#8b4513',
                color: '#fff',
                border: 'none',
                height: 50,
                fontSize: 16,
                fontWeight: 600,
                borderRadius: 8,
                cursor: loading || otp.length !== 6 ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>

          <div style={{ marginTop: 24 }}>
            <p style={{ color: '#888', fontSize: 14, marginBottom: 8 }}>
              Didn't receive the OTP?
            </p>
            {countdown > 0 ? (
              <p style={{ color: '#999', fontSize: 14 }}>
                Resend OTP in {countdown} seconds
              </p>
            ) : (
              <button
                onClick={handleResendOtp}
                disabled={loading}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#8b4513',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: 14,
                  textDecoration: 'underline'
                }}
              >
                Resend OTP
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}