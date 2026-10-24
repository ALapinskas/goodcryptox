import { useEffect, useState } from 'react'
import { AppPage } from './ConnectKey'

function Dashboard() {
  const [price, setPrice] = useState(null)
  const [stats, setStats] = useState(null)
  const [balance, setBalance] = useState(null)
  const [history, setHistory] = useState([])
  const [orders, setOrders] = useState([])
  const [order, setOrder] = useState({ side: 'buy', amount: '', price: '' })
  const [message, setMessage] = useState('')
  const [loadingOrder, setLoadingOrder] = useState(false)

  useEffect(() => {
    const headers = { Authorization: `Bearer ${localStorage.getItem('gcx_token')}` }
    Promise.all([
      fetch('/api/price').then((response) => response.ok ? response.json() : null),
      fetch('/api/history/stats').then((response) => response.ok ? response.json() : null),
      fetch('/api/history?limit=50').then((response) => response.ok ? response.json() : []),
      fetch('/api/trade/balance', { headers }).then((response) => response.ok ? response.json() : null),
      fetch('/api/trade/orders', { headers }).then((response) => response.ok ? response.json() : []),
    ]).then(([current, summary, entries, account, openOrders]) => {
      setPrice(current)
      setStats(summary)
      setHistory(entries)
      setBalance(account)
      setOrders(openOrders)
    }).catch(() => setMessage('Unable to load live account data.'))
  }, [])

  async function refreshOrders() {
    const response = await fetch('/api/trade/orders', { headers: { Authorization: `Bearer ${localStorage.getItem('gcx_token')}` } })
    if (response.ok) setOrders(await response.json())
  }

  async function submitOrder(event) {
    event.preventDefault()
    setLoadingOrder(true)
    setMessage('')
    try {
      const response = await fetch(`/api/trade/${order.side}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('gcx_token')}` },
        body: JSON.stringify({ amount: Number(order.amount), price: order.price ? Number(order.price) : undefined }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.msg || 'Order could not be placed')
      setOrder({ ...order, amount: '', price: '' })
      setMessage(`${order.side === 'buy' ? 'Buy' : 'Sell'} order placed.`)
      refreshOrders()
    } catch (error) { setMessage(error.message) } finally { setLoadingOrder(false) }
  }

  async function cancelOrder(orderId) {
    const response = await fetch(`/api/trade/orders/${orderId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${localStorage.getItem('gcx_token')}` } })
    if (!response.ok) setMessage('Unable to cancel order.')
    refreshOrders()
  }

  return <AppPage title="Trading dashboard" subtitle="Monitor the market and your connected exchange.">
    {message && <p className="form-message">{message}</p>}
    <div className="dashboard-grid">
      <Stat label="ETH/USD" value={price?.price ? `$${Number(price.price).toLocaleString()}` : '—'} detail={price?.change24h != null ? `${Number(price.change24h).toFixed(2)}% today` : 'Live market price'} />
      <Stat label="Session high" value={stats?.high ? `$${Number(stats.high).toLocaleString()}` : '—'} detail={stats?.low ? `Low $${Number(stats.low).toLocaleString()}` : 'Recorded high'} />
      <Stat label="USDT balance" value={balance?.USDT != null ? Number(balance.USDT).toFixed(2) : '—'} detail="Available balance" />
    </div>
    <div className="dashboard-columns">
      <form className="form-card" onSubmit={submitOrder}>
        <h2>Place an order</h2>
        <label>Side<select value={order.side} onChange={(event) => setOrder({ ...order, side: event.target.value })}><option value="buy">Buy ETH</option><option value="sell">Sell ETH</option></select></label>
        <label>Amount (ETH)<input type="number" min="0" step="any" required value={order.amount} onChange={(event) => setOrder({ ...order, amount: event.target.value })} placeholder="0.10" /></label>
        <label>Limit price (optional)<input type="number" min="0" step="any" value={order.price} onChange={(event) => setOrder({ ...order, price: event.target.value })} placeholder="Market order" /></label>
        <button className="connect-button form-submit" disabled={loadingOrder}>{loadingOrder ? 'Submitting…' : 'Place order'}</button>
      </form>
      <section className="panel data-panel"><h2>Open orders</h2>{orders.length === 0 ? <p className="muted">No open orders.</p> : orders.map((item) => <div className="order-row" key={item.id}><span>{item.side} · {item.amount} ETH {item.price ? `@ $${item.price}` : '· market'}</span><button onClick={() => cancelOrder(item.id)}>Cancel</button></div>)}</section>
    </div>
    <section className="panel history-panel"><h2>Recent price history</h2>{history.length === 0 ? <p className="muted">No price history available yet.</p> : <div className="history-list">{history.slice(-8).reverse().map((entry) => <div className="history-row" key={entry.timestamp}><span>{new Date(entry.timestamp).toLocaleTimeString()}</span><strong>${Number(entry.price).toLocaleString()}</strong><span>{Number(entry.change24h).toFixed(2)}%</span></div>)}</div>}</section>
  </AppPage>
}

function Stat({ label, value, detail }) { return <article className="stat-card"><span>{label}</span><strong>{value}</strong><small>{detail}</small></article> }
export default Dashboard
