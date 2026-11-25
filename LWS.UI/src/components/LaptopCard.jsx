import { ArrowUpRight, Cpu, HardDrive, Laptop as LaptopIcon, Monitor } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { formatPrice } from '../utils/formatters'

export default function LaptopCard({ laptop }) {
  const [imgError, setImgError] = useState(false)
  const available = laptop.isAvailable !== false
  const serial = laptop.serialNo || ''

  return (
    <article className="laptop-card">
      <div className="laptop-thumb-wrap">
        {laptop.imageUrl && !imgError ? (
          <img
            src={laptop.imageUrl}
            alt={`${laptop.brand || ''} ${laptop.model || 'Laptop'}`}
            className="laptop-thumb"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="laptop-fallback-img">
            <LaptopIcon size={38} strokeWidth={1.5} />
            <span>No Preview Image</span>
          </div>
        )}
        <span className={`stock-pill ${available ? 'in-stock' : 'out-stock'}`}>
          {available ? 'In Stock' : 'Out of Stock'}
        </span>
      </div>

      <div className="laptop-card-body">
        <div>
          <div className="laptop-brand">{laptop.brand || 'Workstation'}</div>
          <h3 className="laptop-model">{laptop.model || 'Unnamed Model'}</h3>
          {serial && (
            <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
              SN: {serial}
            </div>
          )}
        </div>

        <div className="spec-chips">
          {laptop.processor && (
            <span className="spec-chip">
              <Cpu size={12} style={{ verticalAlign: '-1px', marginRight: 4 }} />
              {laptop.processor}
            </span>
          )}
          {laptop.ram && <span className="spec-chip">{laptop.ram}</span>}
          {laptop.storage && (
            <span className="spec-chip">
              <HardDrive size={12} style={{ verticalAlign: '-1px', marginRight: 4 }} />
              {laptop.storage}
            </span>
          )}
          {laptop.gpu && (
            <span className="spec-chip">
              <Monitor size={12} style={{ verticalAlign: '-1px', marginRight: 4 }} />
              {laptop.gpu}
            </span>
          )}
        </div>

        <div className="laptop-card-footer">
          <div className="price-tag">{formatPrice(laptop.price)}</div>
          {serial ? (
            <Link
              to={`/laptop/${encodeURIComponent(serial)}`}
              className="btn btn-secondary btn-sm"
            >
              View Specs
              <ArrowUpRight size={15} />
            </Link>
          ) : (
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No Serial</span>
          )}
        </div>
      </div>
    </article>
  )
}
