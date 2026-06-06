import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'
import { apiUrl } from '../api'
import Modal from '../components/Modal'

const statusColors = { Pending: '#e67e22', Processing: '#2980b9', Shipped: '#8b4513', Delivered: '#27ae60', Cancelled: '#c0392b' }

export default function MyOrders() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    fetch(apiUrl(`/api/orders/user/${user.id}`))
      .then(res => res.json())
      .then(data => { setOrders(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [user.id])

  return (
    <>
      <Navbar />
      <div style={{ padding: '40px 60px', minHeight: '70vh' }}>
        <h2 style={{ fontFamily: 'Playfair Display,serif', color: '#6b3a2a', marginBottom: 8 }}>My Orders</h2>
        <p style={{ color: '#888', marginBottom: 32 }}>{orders.length} order{orders.length !== 1 ? 's' : ''}</p>

        {loading ? (
          <p style={{ color: '#8b4513', textAlign: 'center' }}>Loading orders...</p>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ fontSize: 48, marginBottom: 16 }}>📦</p>
            <p style={{ color: '#8b4513', fontSize: 18 }}>No orders yet</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {orders.map(order => (
              <div key={order._id} style={{ background: '#fff', border: '1px solid #e0c9a6', borderRadius: 14, padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <p style={{ color: '#8b4513', fontWeight: 700, marginBottom: 4 }}>#{order._id.slice(-8).toUpperCase()}</p>
                    <p style={{ color: '#888', fontSize: 13 }}>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    <p style={{ color: '#6b3a2a', fontSize: 13, marginTop: 4 }}>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ background: statusColors[order.status] || '#888', color: '#fff', padding: '4px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600 }}>{order.status}</span>
                    <p style={{ color: '#8b4513', fontWeight: 700, fontSize: 18, marginTop: 8 }}>Rs. {order.total}</p>
                    <button onClick={() => setSelected(order)} style={{ background: 'none', border: '2px solid #8b4513', color: '#8b4513', borderRadius: 8, padding: '6px 16px', cursor: 'pointer', fontWeight: 600, fontSize: 13, marginTop: 8 }}>View Details</button>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
                  {order.items.slice(0, 4).map((item, i) => (
                    <img key={i} src={item.img} alt={item.name} style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 8, border: '1px solid #e0c9a6' }} />
                  ))}
                  {order.items.length > 4 && <div style={{ width: 56, height: 56, background: '#f0dfc0', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b4513', fontWeight: 600 }}>+{order.items.length - 4}</div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <Modal title={`Order #${selected._id.slice(-8).toUpperCase()}`} onClose={() => setSelected(null)} width={560}>
          <p style={{ color: '#888', fontSize: 13, marginBottom: 16 }}>{new Date(selected.createdAt).toLocaleString()}</p>
          <div style={{ marginBottom: 20 }}>
            {selected.items.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
                <img src={item.img} alt={item.name} style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 8 }} />
                <div style={{ flex: 1 }}>
                  <p style={{ color: '#6b3a2a', fontWeight: 600, fontSize: 14 }}>{item.name}</p>
                  <p style={{ color: '#888', fontSize: 13 }}>Size: {item.size} | Qty: {item.qty}</p>
                </div>
                <p style={{ color: '#8b4513', fontWeight: 700 }}>Rs. {item.price * item.qty}</p>
              </div>
            ))}
          </div>
          <hr style={{ borderColor: '#e0c9a6', marginBottom: 12 }} />
          {[['Subtotal', `Rs. ${selected.subtotal}`], ['Discount', `- Rs. ${selected.discount}`], ['Total', `Rs. ${selected.total}`]].map(([l, v]) => (
            <div key={l} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, color: '#6b3a2a', fontWeight: l === 'Total' ? 700 : 400 }}>
              <span>{l}</span><span>{v}</span>
            </div>
          ))}
          <hr style={{ borderColor: '#e0c9a6', margin: '12px 0' }} />
          <p style={{ color: '#6b3a2a', fontSize: 13 }}><strong>Ship to:</strong> {selected.address.address}, {selected.address.city}, {selected.address.state} - {selected.address.zip}</p>
          <p style={{ color: '#6b3a2a', fontSize: 13, marginTop: 8 }}><strong>Payment:</strong> {selected.address.payment === 'cod' ? 'Cash on Delivery' : 'Card'}</p>
        </Modal>
      )}
      <Footer />
    </>
  )
}
