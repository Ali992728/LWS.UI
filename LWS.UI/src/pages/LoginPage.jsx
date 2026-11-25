import { AlertCircle, CheckCircle2, Eye, EyeOff, LogIn } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { loginApi } from '../api/authApi'
import { useAuth } from '../context/useAuth'

export default function LoginPage() {
  const { loginWithToken, sessionExpiredMessage, clearSessionExpiredMessage } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const registeredMessage = location.state?.registeredMessage || ''
  const redirectTarget = location.state?.from || ''

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    clearSessionExpiredMessage()

    if (!email.trim() || !password) {
      setError('Please enter both email and password.')
      return
    }

    setLoading(true)
    try {
      const res = await loginApi({ email: email.trim(), password })
      const token = res?.data?.token
      if (!token) {
        throw new Error(res?.message || 'Login succeeded but no token was returned.')
      }

      const parsed = loginWithToken(token)
      if (!parsed) {
        throw new Error('Received an invalid or expired token from server.')
      }

      if (parsed.role === 'Admin') {
        navigate('/admin', { replace: true })
      } else {
        navigate(redirectTarget && redirectTarget !== '/admin' ? redirectTarget : '/', {
          replace: true,
        })
      }
    } catch (err) {
      setError(err.message || 'Login failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">
            Sign in with your User or Admin credentials to continue.
          </p>
        </div>

        <form className="form-stack" onSubmit={handleSubmit}>
          {registeredMessage && (
            <div className="alert alert-success">
              <CheckCircle2 size={18} />
              <span>{registeredMessage}</span>
            </div>
          )}

          {sessionExpiredMessage && (
            <div className="alert alert-warning">
              <AlertCircle size={18} />
              <span>{sessionExpiredMessage}</span>
            </div>
          )}

          {error && (
            <div className="alert alert-error">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <div className="field-group">
            <label className="field-label" htmlFor="login-email">
              Email Address
            </label>
            <input
              id="login-email"
              type="email"
              className="input"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="login-password">
              Password
            </label>
            <div className="password-wrap">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                className="input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                style={{ paddingRight: 40 }}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            <LogIn size={17} />
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ marginTop: 20, marginBottom: 0, textAlign: 'center', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
          Don&apos;t have an account?{' '}
          <Link to="/register" style={{ color: 'var(--accent-hover)', fontWeight: 600 }}>
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}
