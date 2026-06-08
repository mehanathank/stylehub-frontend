import { createContext, useContext, useState } from 'react'
import { apiUrl } from '../api'

const AuthContext = createContext()

function initSession() {
  const s = sessionStorage.getItem('sh_session')
  return s ? JSON.parse(s) : null
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(initSession)

  async function register({ name, mobile, email, password }) {
    const nameParts = name.trim().split(' ')
    const firstname = nameParts[0]
    const lastname = nameParts.slice(1).join(' ') || '-'
    try {
      const res = await fetch(apiUrl('/api/users/signup'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstname, lastname, email, phone: mobile, password })
      })
      const data = await res.json()
      if (!res.ok) return { ok: false, msg: data.message }
      const session = { id: data.data.id, name: `${data.data.firstname} ${data.data.lastname}`, email: data.data.email, role: data.data.role }
      sessionStorage.setItem('sh_session', JSON.stringify(session))
      setUser(session)
      return { ok: true }
    } catch (err) {
      return { ok: false, msg: 'Server is starting up, please wait a moment and try again.' }
    }
  }

  async function login(email, password) {
    for (let attempt = 1; attempt <= 6; attempt++) {
      try {
        const res = await fetch(apiUrl('/api/users/login'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        })
        const data = await res.json()
        if (!res.ok) return { ok: false, msg: data.message }
        const session = { id: data.data.id, name: `${data.data.firstname} ${data.data.lastname}`, email: data.data.email, role: data.data.role }
        sessionStorage.setItem('sh_session', JSON.stringify(session))
        setUser(session)
        return { ok: true }
      } catch (err) {
        if (attempt < 6) await new Promise(r => setTimeout(r, 10000))
        else return { ok: false, msg: err.message || 'Server is taking too long to respond. Please try again.' }
      }
    }
  }

  function logout() {
    sessionStorage.removeItem('sh_session')
    setUser(null)
  }

  function updateProfile(updates) {
    const session = { ...user, ...updates }
    sessionStorage.setItem('sh_session', JSON.stringify(session))
    setUser(session)
  }

  return (
    <AuthContext.Provider value={{ user, register, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() { return useContext(AuthContext) }
