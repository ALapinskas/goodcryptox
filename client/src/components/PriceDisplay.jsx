import { useEffect, useState } from 'react'

function formatPrice(value) {
  if (typeof value !== 'number') return '—'
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function formatChange(value) {
  if (typeof value !== 'number') return '—'
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
}

function formatUpdated(timestamp) {
  if (!timestamp) return 'Waiting for scanner data'
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000))
  return `Scanner updated ${seconds < 60 ? `${seconds}s` : `${Math.floor(seconds / 60)}m`} ago`
}

function PriceDisplay() {
  const [priceData, setPriceData] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    let active = true

    async function loadPrice() {
      try {
        const response = await fetch('/api/price')
        if (!response.ok) throw new Error('Price unavailable')
        const data = await response.json()
        if (active) {
          setPriceData(data)
          setError(false)
        }
      } catch {
        if (active) setError(true)
      }
    }

    loadPrice()
    const interval = window.setInterval(loadPrice, 30000)
    return () => {
      active = false
      window.clearInterval(interval)
    }
  }, [])

  const isLoading = !priceData && !error
  const updatedLabel = error ? 'Price scanner unavailable' : formatUpdated(priceData?.timestamp)

  return (
    <div className="price-wrap">
      <div className="price-card" aria-label="Current ETH to USD price" aria-live="polite">
        <span className={`status-dot ${error ? 'status-dot-error' : ''}`} />
        <span className="pair">ETH/USD</span>
        <strong>{isLoading ? 'Loading…' : formatPrice(Number(priceData.price))}</strong>
        {!isLoading && !error && <span className={`change ${priceData.change24h < 0 ? 'change-negative' : ''}`}>{formatChange(Number(priceData.change24h))}</span>}
      </div>
      <p className="updated">{updatedLabel}</p>
    </div>
  )
}

export default PriceDisplay
