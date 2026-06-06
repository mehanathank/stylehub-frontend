import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function UserRoute({ children }) {
  const { user } = useAuth()
  const location = useLocation()
  if (!user) return <Navigate to={`/login?redirect=${location.pathname}`} replace />
  return children
}

export function AdminRoute({ children }) {
  const { user } = useAuth()
  const location = useLocation()
  if (!user) return <Navigate to={`/login?redirect=${location.pathname}`} replace />
  if (user.role !== 'admin') return <Navigate to="/" replace />
  return children
}
