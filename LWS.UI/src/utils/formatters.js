export function formatPrice(price) {
  const numeric = Number(price)
  if (Number.isNaN(numeric)) return '৳0'
  return `৳${new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(numeric)}`
}

export function getLaptopImages(laptop) {
  if (!laptop) return []
  const all = [laptop.imageUrl, ...(Array.isArray(laptop.extraImages) ? laptop.extraImages : [])]
    .map((url) => (typeof url === 'string' ? url.trim() : ''))
    .filter(Boolean)
  return [...new Set(all)]
}

export function formatRemainingTime(expUnixSeconds) {
  if (!expUnixSeconds) return ''
  const diffSec = Math.max(0, Math.floor(expUnixSeconds - Date.now() / 1000))
  const mins = Math.floor(diffSec / 60)
  const secs = diffSec % 60
  return `${mins}:${String(secs).padStart(2, '0')}`
}
