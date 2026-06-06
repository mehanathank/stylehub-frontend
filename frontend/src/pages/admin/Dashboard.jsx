import { useState, useEffect } from 'react'
import AppTable from '../../components/AppTable'
import { apiUrl } from '../../api'

const statusColors = { Pending: '#e67e22', Processing: '#2980b9', Shipped: '#8b4513', Delivered: '#27ae60', Cancelled: '#c0392b' }

export default function Dashboard() {
  const [orders, setOrders] = useState([])
  const [users, setUsers] = useState([])
  const [products, setProducts] = useState([])

  useEffect(() => {
    fetch(apiUrl('/api/orders')).then(r => r.json()).then(d => setOrders(Array.isArray(d) ? d : [])).catch(() => {})
    fetch(apiUrl('/api/users')).then(r => r.json()).then(d => setUsers(Array.isArray(d) ? d : [])).catch(() => {})
    fetch(apiUrl('/api/products')).then(r => r.json()).then(d => setProducts(Array.isArray(d) ? d : [])).catch(() => {})
  }, [])

  const revenue = orders.reduce((s, o) => s + (o.total || 0), 0)

  const stats = [
    { label: 'Total Products', value: products.length, icon: '👕', color: '#8b4513' },
    { label: 'Total Orders', value: orders.length, icon: '📦', color: '#2980b9' },
    { label: 'Total Users', value: users.length, icon: '👥', color: '#27ae60' },
    { label: 'Revenue', value: `Rs. ${revenue}`, icon: '💰', color: '#e67e22' },
  ]

  const cols = [
    { key: '_id', label: 'Order ID', render: v => `#${v.slice(-8).toUpperCase()}` },
    { key: 'userName', label: 'Customer' },
    { key: 'total', label: 'Amount', render: v => `Rs. ${v}` },
    { key: 'status', label: 'Status', render: v => <span style={{ background: statusColors[v] || '#888', color: '#fff', padding: '3px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{v}</span> },
    { key: 'createdAt', label: 'Date', render: v => new Date(v).toLocaleDateString() },
  ]

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ fontFamily: 'Playfair Display,serif', color: '#6b3a2a', marginBottom: 8 }}>Dashboard</h2>
      <p style={{ color: '#888', marginBottom: 32 }}>Welcome back! Here's what's happening.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20, marginBottom: 40 }}>
        {stats.map(({ label, value, icon, color }) => (
          <div key={label} style={{ background: '#fff', borderRadius: 14, padding: 24, border: '1px solid #e0c9a6', borderLeft: `4px solid ${color}` }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
            <p style={{ color, fontWeight: 700, fontSize: 24, margin: 0 }}>{value}</p>
            <p style={{ color: '#888', fontSize: 13, margin: '4px 0 0' }}>{label}</p>
          </div>
        ))}
      </div>

      <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e0c9a6', padding: 24 }}>
        <h4 style={{ color: '#6b3a2a', marginBottom: 20, fontFamily: 'Playfair Display,serif' }}>Recent Orders</h4>
        <AppTable columns={cols} data={orders.slice(0, 10)} emptyMsg="No orders yet." />
      </div>
    </div>
  )
}
