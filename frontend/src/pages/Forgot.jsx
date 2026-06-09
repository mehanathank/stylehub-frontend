import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { apiUrl } from '../api';

export default function Forgot() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Countdown timer for resend OTP
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
    fontSize: 14,
    fontFamily: 'Poppins,sans-serif',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.3s, background-color 0.3s'
  });

  const buttonStyle = (disabled = false) => ({
    width: '100%',
    background: disabled ? '#bdc3c7' : '#8b4513',
    color: '#fff',
    border: 'none',
    height: 50,
    fontSize: 16,
    fontWeight: 600,
    borderRadius: 8,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'background-color 0.3s',
    opacity: loading ? 0.7 : 1
  });

  // Step 1: Send OTP
  async function handleSendOtp(e) {
    e.preventDefault();
    setError('');
    
    if (!email || !email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      // Add timeout controller
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 seconds
      
      const res = await fetch(apiUrl('/api/users/send-otp'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      const data = await res.json();
      
      if (!res.ok) {
        // Handle specific error cases
        if (res.status === 429) {
          setError('Please wait 60 seconds before requesting another OTP');
        } else if (res.status === 404) {
          setError('Email not registered. Please check your email or sign up.');
        } else {
          setError(data.message || 'Failed to send OTP. Please try again.');
        }
        return;
      }
      
      setStep(2);
      setCountdown(60); // Start 60-second countdown
      
    } catch (err) {
      console.error('Send OTP error:', err);
      if (err.name === 'AbortError') {
        setError('Request timed out. Please try again. (Render free tier can be slow)');
      } else {
        setError('Network error. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  // Step 2: Verify OTP
  async function handleVerifyOtp(e) {
    e.preventDefault();
    setError('');
    
    if (!otp || otp.length !== 6) {
      setError('Please enter the 6-digit OTP');
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      setError('OTP must contain only numbers');
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
      
      setStep(3);
      
    } catch (err) {
      console.error('Verify OTP error:', err);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  // Step 3: Change Password
  async function handleChangePassword(e) {
    e.preventDefault();
    setError('');
    
    if (!newPassword || newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Check for weak passwords
    const weakPatterns = [
      /^123456$/,
      /^password$/i,
      /^123456789$/,
      /^qwerty$/i,
      /^abc123$/i
    ];
    
    if (weakPatterns.some(pattern => pattern.test(newPassword))) {
      setError('Please choose a stronger password');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(apiUrl('/api/users/change-password'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.message);
        return;
      }
      
      // Success - redirect to login
      navigate('/login', { 
        state: { 
          message: 'Password reset successful! Please login with your new password.' 
        }
      });
      
    } catch (err) {
      console.error('Change password error:', err);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  // Resend OTP
  function handleResendOtp() {
    if (countdown > 0) return;
    setOtp('');
    setError('');
    setStep(1);
  }

  return (
    <>
      <div style={{
        minHeight: '100vh',
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
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
        }}>
          <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8b4513', display: 'flex', alignItems: 'center', gap: 4, fontSize: 14, fontWeight: 600, marginBottom: 16, padding: 0 }}>
            <FiArrowLeft size={18} /> Back
          </button>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              color: '#8b4513',
              marginBottom: 8,
              fontSize: 28
            }}>
              StyleHub
            </h1>
            <p style={{
              color: '#666',
              fontSize: 16,
              margin: 0
            }}>
              Reset Your Password
            </p>
          </div>

          {/* Progress indicators */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
            {[1, 2, 3].map(s => (
              <div
                key={s}
                style={{
                  flex: 1,
                  height: 6,
                  borderRadius: 4,
                  background: step >= s ? '#8b4513' : '#e0c9a6',
                  transition: 'background-color 0.3s'
                }}
              />
            ))}
          </div>

          {/* Step 1: Enter Email */}
          {step === 1 && (
            <>
              <h3 style={{ color: '#6b3a2a', marginBottom: 8 }}>Enter Your Email</h3>
              <p style={{ color: '#888', marginBottom: 24, fontSize: 14 }}>
                We'll send a 6-digit OTP to your registered email address
              </p>
              
              <form onSubmit={handleSendOtp}>
                <div style={{ marginBottom: 24 }}>
                  <label style={{
                    color: '#6b3a2a',
                    fontWeight: 500,
                    fontSize: 14,
                    display: 'block',
                    marginBottom: 8
                  }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Enter your registered email"
                    style={inputStyle(!!error)}
                    disabled={loading}
                  />
                </div>
                
                {error && (
                  <div style={{
                    background: '#fdf2f2',
                    border: '1px solid #e74c3c',
                    borderRadius: 6,
                    padding: '12px',
                    marginBottom: 20,
                    color: '#c0392b',
                    fontSize: 13
                  }}>
                    {error}
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={loading || !email}
                  style={buttonStyle(loading || !email)}
                >
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </button>
              </form>
              
              <p style={{ textAlign: 'center', color: '#888', marginTop: 20, fontSize: 14 }}>
                Remember your password?{' '}
                <Link to="/login" style={{
                  color: '#8b4513',
                  fontWeight: 600,
                  textDecoration: 'none'
                }}>
                  Sign In
                </Link>
              </p>
            </>
          )}

          {/* Step 2: Enter OTP */}
          {step === 2 && (
            <>
              <h3 style={{ color: '#6b3a2a', marginBottom: 8 }}>Verify OTP</h3>
              <p style={{ color: '#888', marginBottom: 4, fontSize: 14 }}>
                OTP sent to <strong style={{ color: '#6b3a2a' }}>{email}</strong>
              </p>
              <p style={{ color: '#999', fontSize: 12, marginBottom: 24 }}>
                Please check your inbox. The OTP will expire in 10 minutes.
              </p>
              
              <form onSubmit={handleVerifyOtp}>
                <div style={{ marginBottom: 24 }}>
                  <label style={{
                    color: '#6b3a2a',
                    fontWeight: 500,
                    fontSize: 14,
                    display: 'block',
                    marginBottom: 8
                  }}>
                    Enter 6-Digit OTP
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    maxLength={6}
                    style={{
                      ...inputStyle(!!error),
                      fontSize: 24,
                      letterSpacing: 8,
                      textAlign: 'center',
                      fontWeight: 600
                    }}
                    disabled={loading}
                  />
                </div>
                
                {error && (
                  <div style={{
                    background: '#fdf2f2',
                    border: '1px solid #e74c3c',
                    borderRadius: 6,
                    padding: '12px',
                    marginBottom: 20,
                    color: '#c0392b',
                    fontSize: 13
                  }}>
                    {error}
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  style={buttonStyle(loading || otp.length !== 6)}
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </button>
              </form>
              
              <div style={{ textAlign: 'center', marginTop: 20 }}>
                <p style={{ color: '#888', fontSize: 13, marginBottom: 8 }}>
                  Didn't receive the OTP?
                </p>
                {countdown > 0 ? (
                  <p style={{ color: '#999', fontSize: 13 }}>
                    Resend OTP in {countdown} seconds
                  </p>
                ) : (
                  <button
                    onClick={handleResendOtp}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#8b4513',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontSize: 13,
                      textDecoration: 'underline'
                    }}
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            </>
          )}

          {/* Step 3: New Password */}
          {step === 3 && (
            <>
              <h3 style={{ color: '#6b3a2a', marginBottom: 8 }}>Create New Password</h3>
              <p style={{ color: '#888', marginBottom: 24, fontSize: 14 }}>
                Choose a strong password for your StyleHub account
              </p>
              
              <form onSubmit={handleChangePassword}>
                <div style={{ marginBottom: 16 }}>
                  <label style={{
                    color: '#6b3a2a',
                    fontWeight: 500,
                    fontSize: 14,
                    display: 'block',
                    marginBottom: 8
                  }}>
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    style={inputStyle(!!error)}
                    disabled={loading}
                  />
                </div>
                
                <div style={{ marginBottom: 24 }}>
                  <label style={{
                    color: '#6b3a2a',
                    fontWeight: 500,
                    fontSize: 14,
                    display: 'block',
                    marginBottom: 8
                  }}>
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    style={inputStyle(!!error)}
                    disabled={loading}
                  />
                </div>
                
                {error && (
                  <div style={{
                    background: '#fdf2f2',
                    border: '1px solid #e74c3c',
                    borderRadius: 6,
                    padding: '12px',
                    marginBottom: 20,
                    color: '#c0392b',
                    fontSize: 13
                  }}>
                    {error}
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={loading || !newPassword || !confirmPassword}
                  style={buttonStyle(loading || !newPassword || !confirmPassword)}
                >
                  {loading ? 'Updating Password...' : 'Reset Password'}
                </button>
              </form>
              
              {/* Password strength tips */}
              <div style={{
                background: '#f8f9fa',
                border: '1px solid #dee2e6',
                borderRadius: 6,
                padding: '12px',
                marginTop: 16,
                fontSize: 12
              }}>
                <p style={{ margin: '0 0 8px 0', fontWeight: 600, color: '#495057' }}>
                  Password Requirements:
                </p>
                <ul style={{ margin: 0, paddingLeft: 16, color: '#6c757d' }}>
                  <li>At least 6 characters long</li>
                  <li>Avoid common passwords like "123456" or "password"</li>
                  <li>Use a mix of letters, numbers, and symbols (recommended)</li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}