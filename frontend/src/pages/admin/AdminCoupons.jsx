import { useState, useEffect } from 'react'
import AppTable from '../../components/AppTable'
import Modal from '../../components/Modal'
import { useToast } from '../../context/ToastContext'
import { apiUrl } from '../../api'

export default function AdminCoupons() {
  const toast = useToast()
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [confirmId, setConfirmId] = useState(null)
  const [form, setForm] = useState({ code: '', discount: '', description: '' })
  const [errors, setErrors] = useState({})

  function loadCoupons() {
    fetch(apiUrl('/api/coupons'))
      .then(res => res.json())
      .then(data => { setCoupons(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { loadCoupons() }, [])

  function validate() {
    const e = {}
    if (!form.code.trim()) e.code = 'Coupon code required'
    if (!form.discount || isNaN(form.discount) || Number(form.discount) <= 0) e.discount = 'Valid discount amount required'
    return e
  }

  function addCoupon(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    fetch(apiUrl('/api/coupons'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: form.code.trim().toUpperCase(), discount: Number(form.discount), description: form.description.trim() })
    })
      .then(res => res.json())
      .then(data => {
        if (data.data) {
          toast('Coupon created!')
          loadCoupons()
          setShowAdd(false)
          setForm({ code: '', discount: '', description: '' })
          setErrors({})
        } else {
          setErrors({ code: data.message || 'Error creating coupon' })
        }
      })
      .catch(() => toast('Server error.', 'error'))
  }

  function deleteCoupon(id) {
    fetch(apiUrl(`/api/coupons/${id}`), { method: 'DELETE' })
      .then(res => {
        if (res.ok) { toast('Coupon deleted.', 'info'); loadCoupons() }
        else toast('Failed to delete coupon.', 'error')
      })
      .catch(() => toast('Server error.', 'error'))
      .finally(() => setConfirmId(null))
  }

  const cols = [
    { key: 'code', label: 'Code', render: v => <code style={{ background: '#f0dfc0', color: '#8b4513', padding: '3px 10px', borderRadius: 6, fontWeight: 700 }}>{v}</code> },
    { key: 'discount', label: 'Discount', render: v => `${v}% off` },
    { key: 'description', label: 'Description' },
    { key: '_id', label: 'Actions', render: (id) => (
      <button onClick={() => setConfirmId(id)} style={{ background: '#c0392b', color: '#fff', border: 'none', padding: '5px 14px', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Delete</button>
    )}
  ]

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <h2 style={{ fontFamily: 'Playfair Display,serif', color: '#6b3a2a', margin: 0 }}>Coupons</h2>
        <button onClick={() => setShowAdd(true)} className="btn-primary" style={{ padding: '9px 20px', fontSize: 14 }}>+ Create Coupon</button>
      </div>
      {loading ? <p style={{ color: '#8b4513' }}>Loading...</p> : <AppTable columns={cols} data={coupons} emptyMsg="No coupons found." />}

      {showAdd && (
        <Modal title="Create Coupon" onClose={() => { setShowAdd(false); setErrors({}) }} width={420}>
          <form onSubmit={addCoupon}>
            <div className="form-group">
              <label className="form-label">Coupon Code</label>
              <input value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
                className={`form-input${errors.code ? ' error-border' : ''}`} placeholder="e.g. SUMMER30" />
              {errors.code && <p className="error-msg">{errors.code}</p>}
            </div>
            <div className="form-group">
              <label className="form-label">Discount Percentage (%)</label>
              <input type="number" value={form.discount} onChange={e => setForm({ ...form, discount: e.target.value })}
                className={`form-input${errors.discount ? ' error-border' : ''}`} placeholder="e.g. 10" min="1" max="100" />
              {errors.discount && <p className="error-msg">{errors.discount}</p>}
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                className="form-input" placeholder="Short description (optional)" />
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button type="submit" className="btn-primary" style={{ flex: 1 }}>Create Coupon</button>
              <button type="button" onClick={() => { setShowAdd(false); setErrors({}) }}
                style={{ flex: 1, background: '#f0dfc0', color: '#6b3a2a', border: 'none', borderRadius: 10, padding: 13, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
            </div>
          </form>
        </Modal>
      )}

      {confirmId && (
        <Modal title="Delete Coupon" onClose={() => setConfirmId(null)} width={360}>
          <p style={{ color: '#6b3a2a', marginBottom: 24 }}>Are you sure you want to delete this coupon?</p>
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => deleteCoupon(confirmId)} style={{ flex: 1, background: '#c0392b', color: '#fff', border: 'none', borderRadius: 8, padding: 12, fontWeight: 600, cursor: 'pointer' }}>Delete</button>
            <button onClick={() => setConfirmId(null)} style={{ flex: 1, background: '#f0dfc0', color: '#6b3a2a', border: 'none', borderRadius: 8, padding: 12, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
