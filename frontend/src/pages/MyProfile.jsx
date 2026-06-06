import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { apiUrl } from '../api'

export default function MyProfile() {
  const { user, updateProfile } = useAuth()
  const toast = useToast()

  const [profile, setProfile] = useState(null)
  const [orders, setOrders] = useState([])
  const [wishlistCount, setWishlistCount] = useState(0)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ firstname: '', lastname: '', phone: '' })
  const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [pwErrors, setPwErrors] = useState({})

  useEffect(() => {
    fetch(apiUrl(`/api/users/${user.id}`))
      .then(r => r.json())
      .then(d => {
        setProfile(d)
        setForm({ firstname: d.firstname || '', lastname: d.lastname || '', phone: d.phone || '' })
      })
      .catch(() => {})
    fetch(apiUrl(`/api/orders/user/${user.id}`))
      .then(r => r.json())
      .then(d => setOrders(Array.isArray(d) ? d : []))
      .catch(() => {})
    fetch(apiUrl(`/api/wishlist/${user.id}`))
      .then(r => r.json())
      .then(d => setWishlistCount(Array.isArray(d) ? d.length : 0))
      .catch(() => {})
  }, [user.id])

  function saveProfile(e) {
    e.preventDefault()
    const errs = {}
    if (form.firstname.trim().length < 2) errs.firstname = 'First name required'
    if (!/^[0-9]{10,11}$/.test(form.phone)) errs.phone = 'Valid phone required'
    if (Object.keys(errs).length) { setErrors(errs); return }

    fetch(apiUrl(`/api/users/${user.id}`), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstname: form.firstname, lastname: form.lastname, phone: form.phone })
    })
      .then(r => r.json())
      .then(data => {
        if (data.data) {
          const d = data.data
          setProfile(d)
          updateProfile({ name: `${d.firstname} ${d.lastname}` })
          toast('Profile updated successfully!')
          setEditing(false)
          setErrors({})
        } else {
          toast(data.message || 'Failed to update.', 'error')
        }
      })
      .catch(() => toast('Server error.', 'error'))
  }

  function changePassword(e) {
    e.preventDefault()
    const errs = {}
    if (!pwForm.current) errs.current = 'Current password required'
    if (pwForm.newPw.length < 6) errs.newPw = 'Password must be at least 6 characters'
    if (pwForm.newPw !== pwForm.confirm) errs.confirm = 'Passwords do not match'
    if (Object.keys(errs).length) { setPwErrors(errs); return }

    fetch(apiUrl(`/api/users/${user.id}`), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword: pwForm.current, newPassword: pwForm.newPw })
    })
      .then(r => r.json())
      .then(data => {
        if (data.data) {
          toast('Password changed successfully!')
          setPwForm({ current: '', newPw: '', confirm: '' })
          setPwErrors({})
        } else {
          setPwErrors({ current: data.message || 'Failed to change password' })
        }
      })
      .catch(() => toast('Server error.', 'error'))
  }

  const stats = [
    { label: 'Total Orders', value: orders.length, icon: '📦' },
    { label: 'Wishlist Items', value: wishlistCount, icon: '❤️' },
    { label: 'Total Spent', value: `Rs. ${orders.reduce((s, o) => s + (o.total || 0), 0)}`, icon: '💰' },
  ]

  return (
    <>
      <Navbar />
      <div style={{ padding: '40px 60px', minHeight: '70vh' }}>
        <h2 style={{ fontFamily: 'Playfair Display,serif', color: '#6b3a2a', marginBottom: 32 }}>My Profile</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, marginBottom: 40 }}>
          {stats.map(({ label, value, icon }) => (
            <div key={label} style={{ background: '#f0dfc0', borderRadius: 12, padding: 24, textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>{icon}</div>
              <p style={{ color: '#8b4513', fontWeight: 700, fontSize: 22 }}>{value}</p>
              <p style={{ color: '#6b3a2a', fontSize: 13 }}>{label}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
          <div style={{ background: '#fff', border: '1px solid #e0c9a6', borderRadius: 16, padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h4 style={{ fontFamily: 'Playfair Display,serif', color: '#6b3a2a', margin: 0 }}>Personal Info</h4>
              <button onClick={() => setEditing(e => !e)} style={{ background: 'none', border: '2px solid #8b4513', color: '#8b4513', borderRadius: 8, padding: '6px 16px', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
                {editing ? 'Cancel' : 'Edit'}
              </button>
            </div>
            {editing ? (
              <form onSubmit={saveProfile}>
                {[['firstname', 'First Name', 'text'], ['lastname', 'Last Name', 'text'], ['phone', 'Phone', 'tel']].map(([key, label, type]) => (
                  <div key={key} className="form-group">
                    <label className="form-label">{label}</label>
                    <input type={type} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                      className={`form-input${errors[key] ? ' error-border' : ''}`} />
                    {errors[key] && <p className="error-msg">{errors[key]}</p>}
                  </div>
                ))}
                <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: 8 }}>Save Changes</button>
              </form>
            ) : (
              <div>
                {[['👤 Name', profile ? `${profile.firstname} ${profile.lastname}` : ''], ['📧 Email', profile?.email], ['📱 Phone', profile?.phone], ['🎭 Role', profile?.role]].map(([label, val]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f0dfc0', fontSize: 14 }}>
                    <span style={{ color: '#888' }}>{label}</span>
                    <span style={{ color: '#6b3a2a', fontWeight: 500 }}>{val}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ background: '#fff', border: '1px solid #e0c9a6', borderRadius: 16, padding: 28 }}>
            <h4 style={{ fontFamily: 'Playfair Display,serif', color: '#6b3a2a', marginBottom: 20 }}>Change Password</h4>
            <form onSubmit={changePassword}>
              {[['current', 'Current Password'], ['newPw', 'New Password'], ['confirm', 'Confirm New Password']].map(([key, label]) => (
                <div key={key} className="form-group">
                  <label className="form-label">{label}</label>
                  <input type="password" value={pwForm[key]} onChange={e => setPwForm({ ...pwForm, [key]: e.target.value })}
                    className={`form-input${pwErrors[key] ? ' error-border' : ''}`} />
                  {pwErrors[key] && <p className="error-msg">{pwErrors[key]}</p>}
                </div>
              ))}
              <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: 8 }}>Change Password</button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
