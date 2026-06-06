import { useState, useEffect } from 'react'
import AppTable from '../../components/AppTable'
import Modal from '../../components/Modal'
import { useToast } from '../../context/ToastContext'
import { useAuth } from '../../context/AuthContext'
import { apiUrl } from '../../api'

export default function AdminUsers() {
  const { user: me } = useAuth()
  const toast = useToast()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [confirmId, setConfirmId] = useState(null)
  const [search, setSearch] = useState('')

  function loadUsers() {
    fetch(apiUrl('/api/users'))
      .then(res => res.json())
      .then(data => { setUsers(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { loadUsers() }, [])

  function deleteUser(id) {
    if (id === me.id) { toast('Cannot delete your own account.', 'error'); return }
    fetch(apiUrl(`/api/users/${id}`), { method: 'DELETE' })
      .then(res => {
        if (res.ok) { toast('User deleted.', 'info'); loadUsers() }
        else toast('Failed to delete user.', 'error')
      })
      .catch(() => toast('Server error.', 'error'))
      .finally(() => setConfirmId(null))
  }

  const filtered = users.filter(u =>
    `${u.firstname} ${u.lastname}`.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  const cols = [
    { key: 'firstname', label: 'First Name' },
    { key: 'lastname', label: 'Last Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: '_id', label: 'Actions', render: (id) => (
      <button onClick={() => setConfirmId(id)} style={{ background: '#c0392b', color: '#fff', border: 'none', padding: '5px 14px', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Delete</button>
    )}
  ]

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <h2 style={{ fontFamily: 'Playfair Display,serif', color: '#6b3a2a', margin: 0 }}>Users</h2>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..."
          style={{ padding: '9px 14px', border: '1px solid #e0c9a6', borderRadius: 8, fontSize: 14, fontFamily: 'Poppins,sans-serif', outline: 'none', width: 240 }} />
      </div>
      {loading ? <p style={{ color: '#8b4513' }}>Loading...</p> : <AppTable columns={cols} data={filtered} emptyMsg="No users found." />}

      {confirmId && (
        <Modal title="Delete User" onClose={() => setConfirmId(null)} width={360}>
          <p style={{ color: '#6b3a2a', marginBottom: 24 }}>Are you sure you want to delete this user?</p>
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => deleteUser(confirmId)} style={{ flex: 1, background: '#c0392b', color: '#fff', border: 'none', borderRadius: 8, padding: 12, fontWeight: 600, cursor: 'pointer' }}>Delete</button>
            <button onClick={() => setConfirmId(null)} style={{ flex: 1, background: '#f0dfc0', color: '#6b3a2a', border: 'none', borderRadius: 8, padding: 12, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
