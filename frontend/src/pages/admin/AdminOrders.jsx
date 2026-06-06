import { useState, useEffect } from 'react'
import AppTable from '../../components/AppTable'
import Modal from '../../components/Modal'
import { useToast } from '../../context/ToastContext'
import { apiUrl } from '../../api'

const STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']
const statusColors = { Pending: '#e67e22', Processing: '#2980b9', Shipped: '#8b4513', Delivered: '#27ae60', Cancelled: '#c0392b' }

export default function AdminOrders() {
  const toast = useToast()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [search, setSearch] = useState('')

  function loadOrders() {
    fetch(apiUrl('/api/orders'))
      .then(res => res.json())
      .then(data => { setOrders(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { loadOrders() }, [])

  function updateStatus(id, status) {
    fetch(apiUrl(`/api/orders/${id}`), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    })
      .then(res => res.json())
      .then(data => {
        if (data.data) {
          setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o))
          setSelected(prev => prev?._id === id ? { ...prev, status } : prev)
          toast(`Order status updated to ${status}`)
        }
      })
      .catch(() => toast('Failed to update status.', 'error'))
  }

  function deleteOrder(id) {
    fetch(apiUrl(`/api/orders/${id}`), { method: 'DELETE' })
      .then(res => {
        if (res.ok) { toast('Order deleted.', 'info'); loadOrders(); setSelected(null) }
        else toast('Failed to delete order.', 'error')
      })
      .catch(() => toast('Server error.', 'error'))
  }

  const filtered = orders.filter(o =>
    o._id?.toLowerCase().includes(search.toLowerCase()) ||
    o.userName?.toLowerCase().includes(search.toLowerCase())
  )

  const cols = [
    { key: '_id', label: 'Order ID', render: v => `#${v.slice(-8).toUpperCase()}` },
    { key: 'userName', label: 'Customer' },
    { key: 'total', label: 'Amount', render: v => `Rs. ${v}` },
    { key: 'status', label: 'Status', render: v => <span style={{ background: statusColors[v] || '#888', color: '#fff', padding: '3px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{v}</span> },
    { key: 'createdAt', label: 'Date', render: v => new Date(v).toLocaleDateString() },
    { key: '_id', label: 'Action', render: (id, row) => (
      <button onClick={() => setSelected(row)} style={{ background: '#8b4513', color: '#fff', border: 'none', padding: '5px 14px', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Manage</button>
    )}
  ]

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <h2 style={{ fontFamily: 'Playfair Display,serif', color: '#6b3a2a', margin: 0 }}>Orders</h2>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by order ID or customer..."
          style={{ padding: '9px 14px', border: '1px solid #e0c9a6', borderRadius: 8, fontSize: 14, fontFamily: 'Poppins,sans-serif', outline: 'none', width: 280 }} />
      </div>
      {loading ? <p style={{ color: '#8b4513' }}>Loading...</p> : <AppTable columns={cols} data={filtered} emptyMsg="No orders found." />}

      {selected && (
        <Modal title={`Manage Order: #${selected._id.slice(-8).toUpperCase()}`} onClose={() => setSelected(null)} width={580}>
          <div style={{ marginBottom: 20 }}>
            <p style={{ color: '#6b3a2a', marginBottom: 8 }}><strong>Customer:</strong> {selected.userName} ({selected.userEmail})</p>
            <p style={{ color: '#6b3a2a', marginBottom: 8 }}><strong>Total:</strong> Rs. {selected.total}</p>
            <p style={{ color: '#6b3a2a', marginBottom: 16 }}><strong>Address:</strong> {selected.address?.address}, {selected.address?.city}</p>
            <div style={{ marginBottom: 20 }}>
              {selected.items?.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 10 }}>
                  <img src={item.img} alt="" style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 6 }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, color: '#6b3a2a', margin: 0 }}>{item.name} × {item.qty}</p>
                  </div>
                  <p style={{ fontSize: 13, color: '#8b4513', fontWeight: 600 }}>Rs. {item.price * item.qty}</p>
                </div>
              ))}
            </div>
            <label className="form-label">Update Status</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
              {STATUSES.map(s => (
                <button key={s} onClick={() => updateStatus(selected._id, s)} style={{
                  padding: '7px 16px', borderRadius: 20, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13,
                  background: selected.status === s ? statusColors[s] : '#f0dfc0',
                  color: selected.status === s ? '#fff' : '#6b3a2a'
                }}>{s}</button>
              ))}
            </div>
            <div style={{ marginTop: 20, borderTop: '1px solid #e0c9a6', paddingTop: 16 }}>
              <button onClick={() => deleteOrder(selected._id)} style={{ background: '#c0392b', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 20px', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>Delete Order</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
