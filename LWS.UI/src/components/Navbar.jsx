import {
  Laptop,
  LayoutDashboard,
  LogIn,
  LogOut,
  Mail,
  MapPin,
  MessageCircle,
  ShieldCheck,
  UserPlus,
} from 'lucide-react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import lwsLogo from '../assets/lws-logo.jpg'
import { STORE_INFO } from '../constants/storeInfo'
import { useAuth } from '../context/useAuth'

export default function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <>
      <div className="top-strip">
        <div className="container top-strip-inner">
          <span className="top-strip-item">
            <MapPin size={13} color="#ef3e36" />
            <span>{STORE_INFO.address}</span>
          </span>
          <div className="top-strip-links">
            <a href={`mailto:${STORE_INFO.email}`} className="top-strip-item">
              <Mail size={13} color="#ef3e36" />
              <span>{STORE_INFO.email}</span>
            </a>
            <a
              href={STORE_INFO.whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="top-strip-item"
            >
              <MessageCircle size={13} color="#22c55e" />
              <span>WhatsApp: {STORE_INFO.whatsappDisplay}</span>
            </a>
          </div>
        </div>
      </div>

      <header className="navbar">
        <div className="container navbar-inner">
          <Link to="/" className="brand-link" aria-label={STORE_INFO.brandTitle}>
            <img
              src={lwsLogo}
              alt="LWS Laptop Wholesale Store"
              className="brand-logo-img"
            />
          </Link>

          <nav className="nav-links" aria-label="Main navigation">
            <NavLink
              to="/"
              end
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <Laptop size={16} />
              Catalog
            </NavLink>

            {isAdmin && (
              <NavLink
                to="/admin"
                className={({ isActive }) => `nav-link admin-pill ${isActive ? 'active' : ''}`}
              >
                <LayoutDashboard size={16} />
                Admin Dashboard
              </NavLink>
            )}

            {isAuthenticated ? (
              <>
                <span className="user-badge" title={user?.email}>
                  {isAdmin && <ShieldCheck size={15} color="#ef3e36" />}
                  <span>{user?.name?.trim() || user?.email}</span>
                  <span className={`role-chip ${isAdmin ? 'admin' : 'user'}`}>
                    {user?.role}
                  </span>
                </span>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={handleLogout}
                >
                  <LogOut size={15} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  <LogIn size={16} />
                  Login
                </NavLink>
                <NavLink to="/register" className="btn btn-primary btn-sm">
                  <UserPlus size={15} />
                  Register
                </NavLink>
              </>
            )}
          </nav>
        </div>
      </header>
    </>
  )
}
