import { RotateCcw, Search, SlidersHorizontal } from 'lucide-react'
import { useState } from 'react'

const FILTER_MODES = [
  { id: 'all', label: 'All Laptops' },
  { id: 'brand', label: 'By Brand' },
  { id: 'model', label: 'By Model' },
  { id: 'serial', label: 'By Serial No' },
  { id: 'price', label: 'By Price Range' },
]

export default function LaptopFilters({ onFilter, activeLabel, loading }) {
  const [mode, setMode] = useState('all')
  const [textQuery, setTextQuery] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [validationError, setValidationError] = useState('')

  const handleModeSwitch = (nextMode) => {
    setMode(nextMode)
    setValidationError('')
    if (nextMode === 'all') {
      setTextQuery('')
      setMinPrice('')
      setMaxPrice('')
      onFilter({ type: 'all' })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setValidationError('')

    if (mode === 'all') {
      onFilter({ type: 'all' })
      return
    }

    if (mode === 'brand' || mode === 'model' || mode === 'serial') {
      const trimmed = textQuery.trim()
      if (!trimmed) {
        setValidationError(`Please enter a ${mode === 'serial' ? 'serial number' : mode} to search.`)
        return
      }
      onFilter({ type: mode, value: trimmed })
      return
    }

    if (mode === 'price') {
      const min = minPrice === '' ? 0 : Number(minPrice)
      const max = maxPrice === '' ? NaN : Number(maxPrice)
      if (Number.isNaN(min) || Number.isNaN(max)) {
        setValidationError('Please enter both minimum and maximum price.')
        return
      }
      if (min < 0 || max < min) {
        setValidationError('Price range must have min >= 0 and max >= min.')
        return
      }
      onFilter({ type: 'price', minPrice: min, maxPrice: max })
    }
  }

  const handleReset = () => {
    setMode('all')
    setTextQuery('')
    setMinPrice('')
    setMaxPrice('')
    setValidationError('')
    onFilter({ type: 'all' })
  }

  return (
    <section className="filter-panel" aria-label="Filter laptops">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: '0.95rem' }}>
          <SlidersHorizontal size={17} color="var(--accent)" />
          Filter Catalog
        </div>
        {activeLabel && (
          <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Showing: <strong style={{ color: 'var(--text-primary)' }}>{activeLabel}</strong>
          </span>
        )}
      </div>

      <div className="filter-tabs" role="tablist">
        {FILTER_MODES.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={mode === tab.id}
            className={`filter-tab ${mode === tab.id ? 'active' : ''}`}
            onClick={() => handleModeSwitch(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {mode !== 'all' && (
        <form className="filter-form" onSubmit={handleSubmit}>
          {(mode === 'brand' || mode === 'model' || mode === 'serial') && (
            <div className="field-group">
              <label className="field-label" htmlFor="filter-text">
                {mode === 'brand' && 'Brand Name (e.g., dell, hp, lenovo)'}
                {mode === 'model' && 'Model Name (e.g., inspiron, inspiron 14)'}
                {mode === 'serial' && 'Serial Number'}
              </label>
              <input
                id="filter-text"
                type="text"
                className="input"
                placeholder={
                  mode === 'brand'
                    ? 'Type brand name...'
                    : mode === 'model'
                      ? 'Type model name...'
                      : 'Type serial number...'
                }
                value={textQuery}
                onChange={(e) => setTextQuery(e.target.value)}
              />
            </div>
          )}

          {mode === 'price' && (
            <>
              <div className="field-group">
                <label className="field-label" htmlFor="filter-min-price">
                  Min Price (৳)
                </label>
                <input
                  id="filter-min-price"
                  type="number"
                  min="0"
                  step="1"
                  className="input"
                  placeholder="20000"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
              </div>
              <div className="field-group">
                <label className="field-label" htmlFor="filter-max-price">
                  Max Price (৳)
                </label>
                <input
                  id="filter-max-price"
                  type="number"
                  min="0"
                  step="1"
                  className="input"
                  placeholder="150000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
            </>
          )}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            <Search size={16} />
            Search
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleReset} disabled={loading}>
            <RotateCcw size={16} />
            Reset
          </button>
        </form>
      )}

      {validationError && (
        <div className="alert alert-error" style={{ marginTop: 12 }}>
          {validationError}
        </div>
      )}
    </section>
  )
}
