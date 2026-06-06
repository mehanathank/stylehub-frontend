import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { apiUrl } from '../api';

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Get email, otp, and verification status from navigation state
  const { email, otp, verified } = location.state || {};

  // Redirect if required data is missing
  useEffect(() => {
    if (!email || !otp || !verified) {
      navigate('/forgot');
    }
  }, [email, otp, verified, navigate]);

  const inputStyle = (hasErr = false) => ({
    width: '100%',
    padding: '12px 16px',
    border: `2px solid ${hasErr ? '#e74c3c' : '#e0c9a6'}`,
    background: hasErr ? '#fdf2f2' : '#fdf6ee',
    borderRadius: 8,
    fontSize: 14,
    fontFamily: 'Poppins,sans-serif',
    outline: 'none',
    boxSizing: 'border-box'
  });

  async function handleResetPassword(e) {
    e.preventDefault();
    setError('');

    // Validation
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

      // Success - redirect to login with success message
      navigate('/login', {
        state: {
          message: 'Password reset successful! Please login with your new password.',
          type: 'success'
        }
      });

    } catch (err) {
      console.error('Change password error:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  // Show loading if redirecting
  if (!email || !otp || !verified) {
    return (
      <>
        <Navbar />
        <div style={{
          minHeight: '90vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <p>Redirecting...</p>
        </div>
      </>
    );
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
          borderTop: '4px solid #8b4513'
        }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              color: '#8b4513',
              marginBottom: 8
            }}>
              StyleHub
            </h1>
            <h3 style={{ color: '#6b3a2a', marginBottom: 8 }}>Create New Password</h3>
            <p style={{ color: '#888', fontSize: 14 }}>
              Choose a strong password for your account
            </p>
          </div>

          <form onSubmit={handleResetPassword}>
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
              style={{
                width: '100%',
                background: loading || !newPassword || !confirmPassword ? '#bdc3c7' : '#8b4513',
                color: '#fff',
                border: 'none',
                height: 50,
                fontSize: 16,
                fontWeight: 600,
                borderRadius: 8,
                cursor: loading || !newPassword || !confirmPassword ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Updating Password...' : 'Reset Password'}
            </button>
          </form>

          {/* Password strength indicator */}
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
              <li style={{ color: newPassword.length >= 6 ? '#28a745' : '#6c757d' }}>
                At least 6 characters long
              </li>
              <li>Avoid common passwords (123456, password, etc.)</li>
              <li>Mix of letters, numbers, and symbols (recommended)</li>
            </ul>
          </div>

          {/* Security notice */}
          <div style={{
            background: '#e8f4fd',
            border: '1px solid #bee5eb',
            borderRadius: 6,
            padding: '12px',
            marginTop: 12,
            fontSize: 12,
            color: '#0c5460'
          }}>
            <strong>🔒 Security Notice:</strong> Your new password will be encrypted and securely stored. 
            After changing your password, you'll need to login again on all devices.
          </div>
        </div>
      </div>
    </>
  );
}