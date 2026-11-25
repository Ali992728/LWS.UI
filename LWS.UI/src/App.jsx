import { Mail, MapPin, MessageCircle } from 'lucide-react'
import { Link, Navigate, Route, Routes } from 'react-router-dom'
import lwsLogo from './assets/lws-logo.jpg'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import { STORE_INFO } from './constants/storeInfo'
import AdminDashboard from './pages/AdminDashboard'
import HomePage from './pages/HomePage'
import LaptopDetailPage from './pages/LaptopDetailPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import './App.css'

export default function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/laptop/:serialNo" element={<LaptopDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <img
                src={lwsLogo}
                alt={STORE_INFO.brandTitle}
                style={{
                  height: 52,
                  width: 'auto',
                  borderRadius: 8,
                  background: '#ffffff',
                  padding: 4,
                  marginBottom: 12,
                }}
              />
              <p style={{ margin: 0, color: '#94a3b8', maxWidth: '34ch' }}>
                {STORE_INFO.brandTitle} — Quality wholesale &amp; retail laptops in Uttara, Dhaka.
              </p>
            </div>

            <div>
              <h3 className="footer-heading">Showroom Contact</h3>
              <div className="footer-contact-list">
                <div className="footer-contact-item">
                  <MapPin size={16} color="#ef3e36" style={{ flexShrink: 0, marginTop: 3 }} />
                  <span>{STORE_INFO.address}</span>
                </div>
                <a href={`mailto:${STORE_INFO.email}`} className="footer-contact-item">
                  <Mail size={16} color="#ef3e36" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span>{STORE_INFO.email}</span>
                </a>
                <a
                  href={STORE_INFO.whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="footer-contact-item"
                >
                  <MessageCircle size={16} color="#22c55e" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span>WhatsApp: {STORE_INFO.whatsappDisplay}</span>
                </a>
              </div>
            </div>

            <div>
              <h3 className="footer-heading">Quick Links</h3>
              <div className="footer-contact-list">
                <Link to="/" className="footer-contact-item">
                  Laptop Catalog
                </Link>
                <Link to="/login" className="footer-contact-item">
                  Account Login
                </Link>
                <Link to="/register" className="footer-contact-item">
                  Create Account
                </Link>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <span>
              &copy; {new Date().getFullYear()} {STORE_INFO.shortTitle} — {STORE_INFO.brandTitle}
            </span>
            <span>Uttara, Dhaka-1230, Bangladesh</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
