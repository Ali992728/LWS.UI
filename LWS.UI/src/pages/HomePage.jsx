import { AlertCircle, Laptop, MessageCircle, Store } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  getAllLaptopsApi,
  getLaptopsByPriceRangeApi,
} from '../api/laptopApi'
import heroLaptopsImg from '../assets/hero-laptops.png'
import LaptopCard from '../components/LaptopCard'
import LaptopFilters from '../components/LaptopFilters'
import { STORE_INFO } from '../constants/storeInfo'
import { useAuth } from '../context/useAuth'
import { formatPrice } from '../utils/formatters'

export default function HomePage() {
  const { isAdmin } = useAuth()
  const [laptops, setLaptops] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeLabel, setActiveLabel] = useState('All Laptops')

  const loadAll = useCallback(async () => {
    setLoading(true)
    setError('')
    setActiveLabel('All Laptops')
    try {
      const res = await getAllLaptopsApi()
      setLaptops(Array.isArray(res?.data) ? res.data : [])
    } catch (err) {
      setError(err.message || 'Failed to load laptops.')
      setLaptops([])
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
          setError(err.message || 'Failed to load laptops.')
          setLaptops([])
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const handleFilter = async (criteria) => {
    if (criteria.type === 'all') {
      loadAll()
      return
    }

    setLoading(true)
    setError('')
    try {
      if (criteria.type === 'brand') {
        const q = criteria.value.toLowerCase()
        setActiveLabel(`Brand: "${criteria.value}"`)
        const res = await getAllLaptopsApi()
        const all = Array.isArray(res?.data) ? res.data : []
        setLaptops(all.filter((item) => (item.brand || '').toLowerCase().includes(q)))
      } else if (criteria.type === 'model') {
        const q = criteria.value.toLowerCase()
        setActiveLabel(`Model: "${criteria.value}"`)
        const res = await getAllLaptopsApi()
        const all = Array.isArray(res?.data) ? res.data : []
        setLaptops(all.filter((item) => (item.model || '').toLowerCase().includes(q)))
      } else if (criteria.type === 'serial') {
        const q = criteria.value.toLowerCase()
        setActiveLabel(`Serial No: "${criteria.value}"`)
        const res = await getAllLaptopsApi()
        const all = Array.isArray(res?.data) ? res.data : []
        setLaptops(all.filter((item) => (item.serialNo || '').toLowerCase().includes(q)))
      } else if (criteria.type === 'price') {
        setActiveLabel(
          `Price: ${formatPrice(criteria.minPrice)} – ${formatPrice(criteria.maxPrice)}`
        )
        const res = await getLaptopsByPriceRangeApi(criteria.minPrice, criteria.maxPrice)
        setLaptops(Array.isArray(res?.data) ? res.data : [])
      }
    } catch (err) {
      setError(err.message || 'Filter request failed.')
      setLaptops([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <section className="hero-section">
        <div className="hero-circuit-bg" aria-hidden="true" />
        <div className="container hero-grid">
          <div>
            <div className="hero-eyebrow">
              <Store size={14} />
              LAPTOP WHOLESALE STORE — UTTARA, DHAKA
            </div>
            <h1 className="hero-title">
              WE OFFER YOU
              <br />
              BETTER PRICES.
            </h1>
            <p className="hero-subtitle">
              Laptop Wholesale Store is a premier wholesale and retail destination for
              high-performance laptops. We offer a wide selection of like-new gaming and business
              series laptops at unbeatable, budget-friendly prices.
            </p>
            <div className="hero-actions">
              <a href="#catalog" className="btn btn-primary">
                Browse Inventory
              </a>
              <a
                href={STORE_INFO.whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary"
              >
                <MessageCircle size={16} color="#16a34a" />
                WhatsApp: {STORE_INFO.whatsappDisplay}
              </a>
              {isAdmin && (
                <Link to="/admin" className="btn btn-secondary">
                  Open Admin Dashboard
                </Link>
              )}
            </div>
          </div>

          <div className="hero-visual-wrap">
            <img
              src={heroLaptopsImg}
              alt="Laptop Wholesale Store inventory showcase"
              className="hero-visual-img"
            />
          </div>
        </div>
      </section>

      <div className="container">
        <div id="catalog">
          <LaptopFilters onFilter={handleFilter} activeLabel={activeLabel} loading={loading} />
        </div>

        <div className="section-bar">
          <h2 className="section-title">Available Laptops</h2>
          <span style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
            {loading
              ? 'Loading...'
              : `${laptops.length} laptop${laptops.length === 1 ? '' : 's'} shown`}
          </span>
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: 20 }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="state-box">
            <div className="spinner" />
            <p>Loading laptops...</p>
          </div>
        ) : laptops.length === 0 ? (
          <div className="state-box">
            <Laptop size={40} strokeWidth={1.5} style={{ margin: '0 auto 12px', opacity: 0.7 }} />
            <h3 style={{ margin: '0 0 6px', color: 'var(--text-primary)' }}>No laptops matched</h3>
            <p style={{ margin: '0 0 18px' }}>
              Try adjusting your search or resetting to view all laptops.
            </p>
            <button type="button" className="btn btn-secondary" onClick={loadAll}>
              Show All Laptops
            </button>
          </div>
        ) : (
          <div className="laptop-grid">
            {laptops.map((item) => (
              <LaptopCard key={item.id || item.serialNo} laptop={item} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
