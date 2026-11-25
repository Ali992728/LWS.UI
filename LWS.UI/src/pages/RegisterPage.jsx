import { AlertCircle, Eye, EyeOff, UserPlus } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerApi } from '../api/authApi'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const payload = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      phoneNumber: form.phoneNumber.trim(),
      email: form.email.trim(),
      password: form.password,
    }

    if (
      !payload.firstName ||
      !payload.lastName ||
      !payload.phoneNumber ||
      !payload.email ||
      !payload.password
    ) {
      setError('Please fill all required details.')
      return
    }

    setLoading(true)
    try {
      const res = await registerApi(payload)
      navigate('/login', {
        replace: true,
        state: {
          registeredMessage: res?.message || 'User registered successfully. Please sign in.',
        },
      })
    } catch (err) {
      setError(err.message || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card" style={{ maxWidth: 520 }}>
        <div className="auth-header">
          <h1 className="auth-title">Create your account</h1>
          <p className="auth-subtitle">Register a new LWS user account.</p>
        </div>

        <form className="form-stack" onSubmit={handleSubmit}>
          {error && (
            <div className="alert alert-error">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <div className="form-row-2">
            <div className="field-group">
              <label className="field-label" htmlFor="reg-first">
                First Name
              </label>
              <input
                id="reg-first"
                type="text"
                className="input"
                placeholder="John"
                value={form.firstName}
                onChange={handleChange('firstName')}
                required
              />
            </div>
            <div className="field-group">
              <label className="field-label" htmlFor="reg-last">
                Last Name
              </label>
              <input
                id="reg-last"
                type="text"
                className="input"
                placeholder="Doe"
                value={form.lastName}
                onChange={handleChange('lastName')}
                required
              />
            </div>
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="reg-phone">
              Phone Number
            </label>
            <input
              id="reg-phone"
              type="tel"
              className="input"
              placeholder="+1 555 0199"
              value={form.phoneNumber}
              onChange={handleChange('phoneNumber')}
              required
            />
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="reg-email">
              Email Address
            </label>
            <input
              id="reg-email"
              type="email"
              className="input"
              placeholder="name@example.com"
              value={form.email}
              onChange={handleChange('email')}
              autoComplete="email"
              required
            />
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="reg-password">
              Password
            </label>
            <div className="password-wrap">
              <input
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                className="input"
                placeholder="Create a strong password"
                value={form.password}
                onChange={handleChange('password')}
                autoComplete="new-password"
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
            <UserPlus size={17} />
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p style={{ marginTop: 20, marginBottom: 0, textAlign: 'center', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent-hover)', fontWeight: 600 }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
