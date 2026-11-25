import {
  AlertCircle,
  ArrowLeft,
  Cpu,
  HardDrive,
  Laptop as LaptopIcon,
  LayoutDashboard,
  MemoryStick,
  Monitor,
  Tv,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getLaptopBySerialNoApi } from '../api/laptopApi'
import { useAuth } from '../context/useAuth'
import { formatPrice, getLaptopImages } from '../utils/formatters'

export default function LaptopDetailPage() {
  const { serialNo } = useParams()
  const { isAdmin } = useAuth()
  const [laptop, setLaptop] = useState(null)
  const [selectedImage, setSelectedImage] = useState('')
  const [imgError, setImgError] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    async function loadLaptop() {
      setLoading(true)
      setError('')
      setImgError(false)
      try {
        const res = await getLaptopBySerialNoApi(serialNo)
        if (cancelled) return
        const data = res?.data || null
        setLaptop(data)
        const imgs = getLaptopImages(data)
        setSelectedImage(imgs[0] || '')
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Laptop not found.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    loadLaptop()
    return () => {
      cancelled = true
    }
  }, [serialNo])

  if (loading) {
    return (
      <div className="container" style={{ marginTop: 32 }}>
        <div className="state-box">
          <div className="spinner" />
          <p>Loading laptop details...</p>
        </div>
      </div>
    )
  }

  if (error || !laptop) {
    return (
      <div className="container" style={{ marginTop: 32 }}>
        <div className="state-box">
          <AlertCircle size={40} color="#f43f5e" style={{ margin: '0 auto 12px' }} />
          <h2 style={{ margin: '0 0 8px', color: 'var(--text-primary)' }}>
            {error || 'Laptop Not Found'}
          </h2>
          <p style={{ margin: '0 0 20px' }}>
            No laptop exists with serial number <span className="mono">{serialNo}</span>.
          </p>
          <Link to="/" className="btn btn-primary">
            <ArrowLeft size={16} />
            Back to Catalog
          </Link>
        </div>
      </div>
    )
  }

  const images = getLaptopImages(laptop)
  const available = laptop.isAvailable !== false

  return (
    <div className="container" style={{ marginTop: 28 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <Link to="/" className="btn btn-secondary btn-sm">
          <ArrowLeft size={15} />
          Back to Catalog
        </Link>

        {isAdmin && (
          <Link to="/admin" className="btn btn-secondary btn-sm">
            <LayoutDashboard size={15} />
            Manage in Admin Dashboard
          </Link>
        )}
      </div>

      <div className="detail-layout">
        <div className="gallery-card">
          <div className="gallery-main">
            {selectedImage && !imgError ? (
              <img
                src={selectedImage}
                alt={`${laptop.brand || ''} ${laptop.model || 'Laptop'}`}
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="laptop-fallback-img">
                <LaptopIcon size={54} strokeWidth={1.4} />
                <span>No Image Available</span>
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div className="gallery-thumbs">
              {images.map((imgUrl, idx) => (
                <button
                  key={`${imgUrl}-${idx}`}
                  type="button"
                  className={`gallery-thumb-btn ${selectedImage === imgUrl ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedImage(imgUrl)
                    setImgError(false)
                  }}
                >
                  <img src={imgUrl} alt={`View ${idx + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="detail-panel">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
            <span className="laptop-brand">{laptop.brand || 'Workstation'}</span>
            <span className={`badge-pill ${available ? 'ok' : 'no'}`}>
              {available ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          <h1 style={{ margin: '8px 0 6px', fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            {laptop.model || 'Laptop Model'}
          </h1>
          <div className="mono" style={{ color: 'var(--text-muted)', fontSize: '0.86rem' }}>
            Serial No: {laptop.serialNo}
          </div>

          <div
            style={{
              marginTop: 20,
              padding: '16px 18px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-canvas)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Price</span>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent)' }}>
              {formatPrice(laptop.price)}
            </span>
          </div>

          <h2 style={{ margin: '24px 0 0', fontSize: '1rem', fontWeight: 700 }}>
            Hardware Specifications
          </h2>

          <div className="specs-grid">
            <div className="spec-box">
              <div className="spec-box-label">
                <Cpu size={12} style={{ verticalAlign: '-1px', marginRight: 5 }} />
                Processor
              </div>
              <div className="spec-box-val">{laptop.processor || '—'}</div>
            </div>
            <div className="spec-box">
              <div className="spec-box-label">
                <MemoryStick size={12} style={{ verticalAlign: '-1px', marginRight: 5 }} />
                RAM
              </div>
              <div className="spec-box-val">{laptop.ram || '—'}</div>
            </div>
            <div className="spec-box">
              <div className="spec-box-label">
                <HardDrive size={12} style={{ verticalAlign: '-1px', marginRight: 5 }} />
                Storage
              </div>
              <div className="spec-box-val">{laptop.storage || '—'}</div>
            </div>
            <div className="spec-box">
              <div className="spec-box-label">
                <Monitor size={12} style={{ verticalAlign: '-1px', marginRight: 5 }} />
                Graphics (GPU)
              </div>
              <div className="spec-box-val">{laptop.gpu || '—'}</div>
            </div>
            <div className="spec-box" style={{ gridColumn: '1 / -1' }}>
              <div className="spec-box-label">
                <Tv size={12} style={{ verticalAlign: '-1px', marginRight: 5 }} />
                Display
              </div>
              <div className="spec-box-val">{laptop.display || '—'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
