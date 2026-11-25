import { X } from 'lucide-react'
import { useState } from 'react'

function buildInitialState(initialLaptop) {
  return {
    serialNo: initialLaptop?.serialNo || '',
    brand: initialLaptop?.brand || '',
    model: initialLaptop?.model || '',
    processor: initialLaptop?.processor || '',
    ram: initialLaptop?.ram || '',
    storage: initialLaptop?.storage || '',
    gpu: initialLaptop?.gpu || '',
    display: initialLaptop?.display || '',
    price: initialLaptop?.price ?? '',
    isAvailable: initialLaptop?.isAvailable !== false,
    imageUrl: initialLaptop?.imageUrl || '',
    extraImagesText: Array.isArray(initialLaptop?.extraImages)
      ? initialLaptop.extraImages.join('\n')
      : '',
  }
}

export default function LaptopFormModal({ mode, initialLaptop, onClose, onSubmit, submitting }) {
  const isEdit = mode === 'edit'
  const [form, setForm] = useState(() => buildInitialState(initialLaptop))
  const [error, setError] = useState('')

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const serialNo = form.serialNo.trim()
    const brand = form.brand.trim()
    const model = form.model.trim()
    const priceNum = Number(form.price)

    if (!serialNo) {
      setError('Serial Number is required.')
      return
    }
    if (!brand || !model) {
      setError('Brand and Model are required.')
      return
    }
    if (form.price === '' || Number.isNaN(priceNum) || priceNum < 0) {
      setError('Please enter a valid non-negative price.')
      return
    }

    const extraImages = form.extraImagesText
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter(Boolean)

    const payload = {
      ...(isEdit && initialLaptop?.id ? { id: initialLaptop.id } : {}),
      serialNo,
      brand,
      model,
      processor: form.processor.trim(),
      ram: form.ram.trim(),
      storage: form.storage.trim(),
      gpu: form.gpu.trim(),
      display: form.display.trim(),
      price: priceNum,
      isAvailable: form.isAvailable,
      imageUrl: form.imageUrl.trim(),
      extraImages,
    }

    try {
      await onSubmit(payload)
    } catch (err) {
      setError(err.message || 'Operation failed.')
    }
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-card">
        <div className="modal-header">
          <h2 className="modal-title">
            {isEdit ? `Edit Laptop (${initialLaptop?.serialNo})` : 'Add New Laptop'}
          </h2>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-stack">
              {error && <div className="alert alert-error">{error}</div>}

              <div className="form-row-2">
                <div className="field-group">
                  <label className="field-label" htmlFor="lap-serial">
                    Serial Number *
                  </label>
                  <input
                    id="lap-serial"
                    type="text"
                    className="input mono"
                    placeholder="SN-XPS-001"
                    value={form.serialNo}
                    onChange={handleChange('serialNo')}
                    disabled={isEdit}
                    required
                  />
                </div>
                <div className="field-group">
                  <label className="field-label" htmlFor="lap-price">
                    Price (৳) *
                  </label>
                  <input
                    id="lap-price"
                    type="number"
                    min="0"
                    step="0.01"
                    className="input"
                    placeholder="85000"
                    value={form.price}
                    onChange={handleChange('price')}
                    required
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="field-group">
                  <label className="field-label" htmlFor="lap-brand">
                    Brand *
                  </label>
                  <input
                    id="lap-brand"
                    type="text"
                    className="input"
                    placeholder="Dell"
                    value={form.brand}
                    onChange={handleChange('brand')}
                    required
                  />
                </div>
                <div className="field-group">
                  <label className="field-label" htmlFor="lap-model">
                    Model *
                  </label>
                  <input
                    id="lap-model"
                    type="text"
                    className="input"
                    placeholder="XPS 15 9530"
                    value={form.model}
                    onChange={handleChange('model')}
                    required
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="field-group">
                  <label className="field-label" htmlFor="lap-cpu">
                    Processor
                  </label>
                  <input
                    id="lap-cpu"
                    type="text"
                    className="input"
                    placeholder="Intel Core i7-13700H"
                    value={form.processor}
                    onChange={handleChange('processor')}
                  />
                </div>
                <div className="field-group">
                  <label className="field-label" htmlFor="lap-ram">
                    RAM
                  </label>
                  <input
                    id="lap-ram"
                    type="text"
                    className="input"
                    placeholder="32GB DDR5"
                    value={form.ram}
                    onChange={handleChange('ram')}
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="field-group">
                  <label className="field-label" htmlFor="lap-storage">
                    Storage
                  </label>
                  <input
                    id="lap-storage"
                    type="text"
                    className="input"
                    placeholder="1TB NVMe SSD"
                    value={form.storage}
                    onChange={handleChange('storage')}
                  />
                </div>
                <div className="field-group">
                  <label className="field-label" htmlFor="lap-gpu">
                    Graphics (GPU)
                  </label>
                  <input
                    id="lap-gpu"
                    type="text"
                    className="input"
                    placeholder="RTX 4070 8GB"
                    value={form.gpu}
                    onChange={handleChange('gpu')}
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="field-group">
                  <label className="field-label" htmlFor="lap-display">
                    Display
                  </label>
                  <input
                    id="lap-display"
                    type="text"
                    className="input"
                    placeholder="15.6&quot; 3.5K OLED Touch"
                    value={form.display}
                    onChange={handleChange('display')}
                  />
                </div>
                <div className="field-group">
                  <label className="field-label" htmlFor="lap-avail">
                    Availability
                  </label>
                  <select
                    id="lap-avail"
                    className="select"
                    value={form.isAvailable ? 'true' : 'false'}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, isAvailable: e.target.value === 'true' }))
                    }
                  >
                    <option value="true">In Stock (Available)</option>
                    <option value="false">Out of Stock (Unavailable)</option>
                  </select>
                </div>
              </div>

              {!isEdit && (
                <>
                  <div className="field-group">
                    <label className="field-label" htmlFor="lap-img">
                      Primary Image URL
                    </label>
                    <input
                      id="lap-img"
                      type="url"
                      className="input"
                      placeholder="https://example.com/laptop.jpg"
                      value={form.imageUrl}
                      onChange={handleChange('imageUrl')}
                    />
                  </div>
                  <div className="field-group">
                    <label className="field-label" htmlFor="lap-extra-imgs">
                      Extra Image URLs (one per line or comma-separated)
                    </label>
                    <textarea
                      id="lap-extra-imgs"
                      rows={3}
                      className="textarea"
                      placeholder="https://example.com/angle-1.jpg&#10;https://example.com/angle-2.jpg"
                      value={form.extraImagesText}
                      onChange={handleChange('extraImagesText')}
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting
                ? isEdit
                  ? 'Saving Changes...'
                  : 'Adding Laptop...'
                : isEdit
                  ? 'Save Changes'
                  : 'Add Laptop'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
