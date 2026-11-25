import {
  AlertCircle,
  CheckCircle2,
  Clock,
  ExternalLink,
  Laptop as LaptopIcon,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  addLaptopApi,
  deleteLaptopApi,
  getAllLaptopsApi,
  updateLaptopApi,
} from '../api/laptopApi'
import LaptopFormModal from '../components/LaptopFormModal'
import { useAuth } from '../context/useAuth'
import { formatPrice, formatRemainingTime } from '../utils/formatters'

export default function AdminDashboard() {
  const { user } = useAuth()
  const [laptops, setLaptops] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [modalState, setModalState] = useState({ open: false, mode: 'add', laptop: null })
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [timeLeft, setTimeLeft] = useState(() => formatRemainingTime(user?.exp))

  useEffect(() => {
    if (!user?.exp) return undefined
    const timer = setInterval(() => {
      setTimeLeft(formatRemainingTime(user.exp))
    }, 1000)
    return () => clearInterval(timer)
  }, [user?.exp])

  const loadLaptops = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await getAllLaptopsApi()
      setLaptops(Array.isArray(res?.data) ? res.data : [])
    } catch (err) {
      setError(err.message || 'Failed to load inventory.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    getAllLaptopsApi()
      .then((res) => {
        if (!cancelled) {
          setLaptops(Array.isArray(res?.data) ? res.data : [])
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || 'Failed to load inventory.')
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const filteredLaptops = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return laptops
    return laptops.filter((item) =>
      [item.serialNo, item.brand, item.model, item.processor, item.gpu]
        .filter(Boolean)
        .some((val) => val.toLowerCase().includes(q))
    )
  }, [laptops, searchQuery])

  const stats = useMemo(() => {
    const total = laptops.length
    const inStock = laptops.filter((l) => l.isAvailable !== false).length
    const outOfStock = total - inStock
    const avgPrice =
      total > 0 ? laptops.reduce((sum, l) => sum + Number(l.price || 0), 0) / total : 0
    return { total, inStock, outOfStock, avgPrice }
  }, [laptops])

  const handleSaveLaptop = async (payload) => {
    setSubmitting(true)
    setFeedback('')
    setError('')
    try {
      if (modalState.mode === 'add') {
        const res = await addLaptopApi(payload)
        setFeedback(res?.message || 'Laptop added successfully.')
      } else {
        const res = await updateLaptopApi(payload)
        setFeedback(res?.message || 'Laptop updated successfully.')
      }
      setModalState({ open: false, mode: 'add', laptop: null })
      await loadLaptops()
    } finally {
      setSubmitting(false)
    }
  }

  const handleConfirmDelete = async () => {
    if (!deleteTarget?.serialNo) return
    setSubmitting(true)
    setFeedback('')
    setError('')
    try {
      const res = await deleteLaptopApi(deleteTarget.serialNo)
      setFeedback(res?.message || 'Laptop deleted successfully.')
      setDeleteTarget(null)
      await loadLaptops()
    } catch (err) {
      setError(err.message || 'Delete failed.')
      setDeleteTarget(null)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container">
      <section className="admin-header">
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#fbbf24', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            <ShieldCheck size={16} />
            Admin Control Center
          </div>
          <h1 style={{ margin: '6px 0 4px', fontSize: '1.85rem', fontWeight: 800 }}>
            Laptop Inventory Dashboard
          </h1>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            Signed in as <strong>{user?.email}</strong> — Manage catalog items (Add, Update,
            Delete).
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {timeLeft && (
            <span className="user-badge" title="Backend JWT expires after 5 minutes">
              <Clock size={14} color="#fbbf24" />
              Session: <strong className="mono">{timeLeft}</strong>
            </span>
          )}
          <Link to="/" className="btn btn-secondary btn-sm">
            <ExternalLink size={15} />
            View Storefront
          </Link>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setModalState({ open: true, mode: 'add', laptop: null })}
          >
            <Plus size={17} />
            Add Laptop
          </button>
        </div>
      </section>

      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-label">Total Laptops</div>
          <div className="stat-card-value">{stats.total}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">In Stock</div>
          <div className="stat-card-value" style={{ color: 'var(--success)' }}>
            {stats.inStock}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Out of Stock</div>
          <div className="stat-card-value" style={{ color: 'var(--danger)' }}>
            {stats.outOfStock}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Average Price</div>
          <div className="stat-card-value" style={{ color: 'var(--accent)' }}>
            {formatPrice(stats.avgPrice)}
          </div>
        </div>
      </section>

      {feedback && (
        <div className="alert alert-success" style={{ marginTop: 18 }}>
          <CheckCircle2 size={18} />
          <span>{feedback}</span>
        </div>
      )}

      {error && (
        <div className="alert alert-error" style={{ marginTop: 18 }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <section className="table-card">
        <div className="table-toolbar">
          <div style={{ position: 'relative', flex: '1 1 260px', maxWidth: 420 }}>
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
              }}
            />
            <input
              type="text"
              className="input"
              style={{ paddingLeft: 36 }}
              placeholder="Filter table by serial, brand, model, CPU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={loadLaptops}
            disabled={loading}
          >
            <RefreshCw size={15} />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="state-box" style={{ border: 'none', borderRadius: 0 }}>
            <div className="spinner" />
            <p>Loading inventory...</p>
          </div>
        ) : filteredLaptops.length === 0 ? (
          <div className="state-box" style={{ border: 'none', borderRadius: 0 }}>
            <LaptopIcon size={36} strokeWidth={1.5} style={{ margin: '0 auto 10px', opacity: 0.7 }} />
            <p style={{ margin: '0 0 14px' }}>No laptops in inventory match your search.</p>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => setModalState({ open: true, mode: 'add', laptop: null })}
            >
              <Plus size={15} />
              Add First Laptop
            </button>
          </div>
        ) : (
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Laptop</th>
                  <th>Serial No</th>
                  <th>Specs</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLaptops.map((item) => {
                  const available = item.isAvailable !== false
                  return (
                    <tr key={item.id || item.serialNo}>
                      <td>
                        <div className="table-laptop-cell">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.model || 'Laptop'}
                              className="table-thumb"
                            />
                          ) : (
                            <div
                              className="table-thumb"
                              style={{ display: 'grid', placeItems: 'center', color: 'var(--text-muted)' }}
                            >
                              <LaptopIcon size={18} />
                            </div>
                          )}
                          <div>
                            <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                              {item.brand} {item.model}
                            </div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                              {item.display || 'Standard Display'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="mono" style={{ fontSize: '0.82rem' }}>
                        {item.serialNo}
                      </td>
                      <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                        {[item.processor, item.ram, item.storage, item.gpu]
                          .filter(Boolean)
                          .join(' · ') || '—'}
                      </td>
                      <td style={{ fontWeight: 700 }}>{formatPrice(item.price)}</td>
                      <td>
                        <span className={`badge-pill ${available ? 'ok' : 'no'}`}>
                          {available ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                          {item.serialNo && (
                            <Link
                              to={`/laptop/${encodeURIComponent(item.serialNo)}`}
                              className="btn btn-secondary btn-sm"
                              title="View details"
                            >
                              View
                            </Link>
                          )}
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() =>
                              setModalState({ open: true, mode: 'edit', laptop: item })
                            }
                          >
                            <Pencil size={14} />
                            Edit
                          </button>
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => setDeleteTarget(item)}
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {modalState.open && (
        <LaptopFormModal
          mode={modalState.mode}
          initialLaptop={modalState.laptop}
          onClose={() => setModalState({ open: false, mode: 'add', laptop: null })}
          onSubmit={handleSaveLaptop}
          submitting={submitting}
        />
      )}

      {deleteTarget && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-card" style={{ maxWidth: 440 }}>
            <div className="modal-header">
              <h2 className="modal-title">Delete Laptop</h2>
            </div>
            <div className="modal-body">
              <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                Are you sure you want to permanently delete{' '}
                <strong style={{ color: 'var(--text-primary)' }}>
                  {deleteTarget.brand} {deleteTarget.model}
                </strong>{' '}
                (Serial: <span className="mono">{deleteTarget.serialNo}</span>)?
              </p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setDeleteTarget(null)}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger-solid"
                onClick={handleConfirmDelete}
                disabled={submitting}
              >
                {submitting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
