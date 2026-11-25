import { ShieldAlert } from 'lucide-react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { isAuthenticated, isAdmin } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="container" style={{ marginTop: 40 }}>
        <div className="state-box">
          <ShieldAlert size={40} color="#f43f5e" style={{ margin: '0 auto 12px' }} />
          <h2 style={{ margin: '0 0 8px', color: 'var(--text-primary)' }}>
            Admin Access Required
          </h2>
          <p style={{ margin: '0 0 20px' }}>
            You are signed in as a regular User. Only the Admin account can manage laptop
            inventory.
          </p>
          <Link to="/" className="btn btn-primary">
            Back to Catalog
          </Link>
        </div>
      </div>
    )
  }

  return children
}
