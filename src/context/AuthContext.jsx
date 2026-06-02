import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

function seedAdmin() {
  const users = JSON.parse(localStorage.getItem('sh_users') || '[]')
  if (!users.find(u => u.role === 'admin')) {
    const admin = { id: 1, name: 'Admin', mobile: '0000000000', email: 'admin@stylehub.com', password: 'admin123', role: 'admin', createdAt: new Date().toISOString() }
    localStorage.setItem('sh_users', JSON.stringify([admin, ...users]))
  }
}

function getUsers() {
  return JSON.parse(localStorage.getItem('sh_users') || '[]')
}

function initSession() {
  seedAdmin()
  const s = localStorage.getItem('sh_session') || sessionStorage.getItem('sh_session')
  return s ? JSON.parse(s) : null
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(initSession)

  function register({ name, mobile, email, password }) {
    const users = getUsers()
    if (users.find(u => u.email === email)) return { ok: false, msg: 'Email already registered' }
    const newUser = { id: Date.now(), name, mobile, email, password, role: 'user', createdAt: new Date().toISOString() }
    localStorage.setItem('sh_users', JSON.stringify([...users, newUser]))
    const session = { id: newUser.id, name, email, role: 'user' }
    localStorage.setItem('sh_session', JSON.stringify(session))
    setUser(session)
    return { ok: true }
  }

  function login(email, password, remember) {
    const users = getUsers()
    const found = users.find(u => u.email === email && u.password === password)
    if (!found) return { ok: false, msg: 'Invalid email or password' }
    const session = { id: found.id, name: found.name, email: found.email, role: found.role }
    // always save to localStorage so data is not lost on refresh
    localStorage.setItem('sh_session', JSON.stringify(session))
    setUser(session)
    return { ok: true }
  }

  function logout() {
    localStorage.removeItem('sh_session')
    sessionStorage.removeItem('sh_session')
    setUser(null)
  }

  function updateProfile(updates) {
    const users = getUsers()
    const idx = users.findIndex(u => u.id === user.id)
    if (idx === -1) return
    users[idx] = { ...users[idx], ...updates }
    localStorage.setItem('sh_users', JSON.stringify(users))
    if (!updates.password) {
      const session = { ...user, name: updates.name || user.name, email: updates.email || user.email }
      localStorage.setItem('sh_session', JSON.stringify(session))
      setUser(session)
    }
  }

  return (
    <AuthContext.Provider value={{ user, register, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() { return useContext(AuthContext) }
