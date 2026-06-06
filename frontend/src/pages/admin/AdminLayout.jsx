import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'

const navItems = [
  { to: '/admin', label: '📊 Dashboard', end: true },
  { to: '/admin/products', label: '👕 Products' },
  { to: '/admin/add-product', label: '➕ Add Product' },
  { to: '/admin/orders', label: '📦 Orders' },
  { to: '/admin/users', label: '👥 Users' },
  { to: '/admin/coupons', label: '🏷️ Coupons' },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    toast('Logged out.', 'info')
    navigate('/')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Poppins,sans-serif' }}>
      <aside style={{ width: 240, background: '#3b1f10', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '28px 24px 20px', borderBottom: '1px solid #5a3020' }}>
          <p style={{ fontFamily: 'Playfair Display,serif', color: '#fff', fontSize: 22, margin: 0 }}>StyleHub</p>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, margin: '4px 0 0' }}>Admin Panel</p>
        </div>
        <nav style={{ flex: 1, padding: '16px 12px' }}>
          {navItems.map(({ to, label, end }) => (
            <NavLink key={to} to={to} end={end} style={({ isActive }) => ({
              display: 'block', padding: '11px 16px', borderRadius: 8, marginBottom: 4,
              textDecoration: 'none', fontSize: 14, fontWeight: 500,
              background: isActive ? '#8b4513' : 'transparent',
              color: isActive ? '#fff' : 'rgba(255,255,255,0.7)',
              transition: 'all 0.15s'
            })}>
              {label}
            </NavLink>
          ))}
        </nav>
        <div style={{ padding: 16, borderTop: '1px solid #5a3020' }}>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 8 }}>{user?.name}</p>
          <button onClick={() => navigate('/')} style={{ width: '100%', background: 'transparent', border: '1px solid #5a3020', color: 'rgba(255,255,255,0.7)', borderRadius: 8, padding: '8px', cursor: 'pointer', fontSize: 13, marginBottom: 8 }}>🏠 Home</button>
          <button onClick={handleLogout} style={{ width: '100%', background: 'transparent', border: '1px solid #5a3020', color: 'rgba(255,255,255,0.7)', borderRadius: 8, padding: '8px', cursor: 'pointer', fontSize: 13 }}>Logout</button>
        </div>
      </aside>
      <main style={{ flex: 1, background: '#fdf6ee', overflowY: 'auto' }}>
        <Outlet />
      </main>
    </div>
  )
}
