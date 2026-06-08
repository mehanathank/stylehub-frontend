import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: '📊', end: true },
  { to: '/admin/products', label: 'Products', icon: '👕' },
  { to: '/admin/add-product', label: 'Add Product', icon: '➕' },
  { to: '/admin/orders', label: 'Orders', icon: '📦' },
  { to: '/admin/users', label: 'Users', icon: '👥' },
  { to: '/admin/coupons', label: 'Coupons', icon: '🏷️' },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  function handleLogout() {
    logout()
    toast('Logged out.', 'info')
    navigate('/')
  }

  function handleNav() {
    setSidebarOpen(false)
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Poppins,sans-serif', position: 'relative' }}>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            zIndex: 40, display: 'none'
          }}
          className="admin-overlay"
        />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'admin-sidebar-open' : ''}`}
        style={{
          width: 240, background: '#3b1f10', flexShrink: 0,
          display: 'flex', flexDirection: 'column',
          position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50,
          transform: 'translateX(-100%)',
          transition: 'transform 0.25s ease'
        }}>
        <div style={{ padding: '24px 20px 16px', borderBottom: '1px solid #5a3020', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontFamily: 'Playfair Display,serif', color: '#fff', fontSize: 20, margin: 0 }}>StyleHub</p>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, margin: '2px 0 0' }}>Admin Panel</p>
          </div>
          <button onClick={() => setSidebarOpen(false)}
            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: 20, cursor: 'pointer', display: 'none' }}
            className="sidebar-close-btn">
            ✕
          </button>
        </div>

        <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
          {navItems.map(({ to, label, icon, end }) => (
            <NavLink key={to} to={to} end={end} onClick={handleNav}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '11px 14px', borderRadius: 8, marginBottom: 3,
                textDecoration: 'none', fontSize: 14, fontWeight: 500,
                background: isActive ? '#8b4513' : 'transparent',
                color: isActive ? '#fff' : 'rgba(255,255,255,0.7)',
                transition: 'all 0.15s'
              })}>
              <span>{icon}</span>
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: '12px 10px', borderTop: '1px solid #5a3020' }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginBottom: 10, paddingLeft: 4 }}>
            {user?.firstname} {user?.lastname}
          </p>
          <button onClick={() => { navigate('/'); setSidebarOpen(false) }}
            style={{ width: '100%', background: 'transparent', border: '1px solid #5a3020', color: 'rgba(255,255,255,0.7)', borderRadius: 8, padding: '9px', cursor: 'pointer', fontSize: 13, marginBottom: 8 }}>
            🏠 Home
          </button>
          <button onClick={handleLogout}
            style={{ width: '100%', background: 'transparent', border: '1px solid #5a3020', color: 'rgba(255,255,255,0.7)', borderRadius: 8, padding: '9px', cursor: 'pointer', fontSize: 13 }}>
            Logout
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }} className="admin-main-wrapper">

        {/* Mobile topbar */}
        <div className="admin-topbar"
          style={{
            display: 'none', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 16px', background: '#3b1f10',
            position: 'sticky', top: 0, zIndex: 30
          }}>
          <button onClick={() => setSidebarOpen(true)}
            style={{ background: 'none', border: 'none', color: '#fff', fontSize: 22, cursor: 'pointer', padding: 4 }}>
            ☰
          </button>
          <p style={{ fontFamily: 'Playfair Display,serif', color: '#fff', fontSize: 18, margin: 0 }}>StyleHub Admin</p>
          <button onClick={handleLogout}
            style={{ background: 'none', border: '1px solid rgba(255,255,255,0.3)', color: 'rgba(255,255,255,0.8)', borderRadius: 6, padding: '5px 10px', cursor: 'pointer', fontSize: 12 }}>
            Logout
          </button>
        </div>

        <main style={{ flex: 1, background: '#fdf6ee', overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>

      <style>{`
        @media (min-width: 769px) {
          .admin-sidebar {
            position: relative !important;
            transform: translateX(0) !important;
          }
          .admin-main-wrapper {
            margin-left: 0;
          }
        }

        @media (max-width: 768px) {
          .admin-topbar {
            display: flex !important;
          }
          .admin-overlay {
            display: block !important;
          }
          .sidebar-close-btn {
            display: block !important;
          }
          .admin-sidebar-open {
            transform: translateX(0) !important;
          }
        }
      `}</style>
    </div>
  )
}