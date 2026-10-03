import { useMemo } from 'react'
import { Activity, ArrowDownLeft, ArrowUpRight, TrendingUp } from 'lucide-react'
import { money, prettyDate } from '../utils/format'

const chart = { width: 400, height: 156, left: 15, right: 385, top: 13, bottom: 110 }

export default function BalanceTrend({ user, transactions, className = '' }) {
  const history = useMemo(() => {
    const recent = transactions
      .filter(transaction => transaction.userId === user.id)
      .sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id))
      .slice(-6)
      .map(transaction => ({
        id: transaction.id,
        date: transaction.date,
        balance: Number(transaction.balance) || 0,
        description: `${transaction.type} · ${transaction.description}`
      }))

    const lastEntry = recent.at(-1)
    if (lastEntry && lastEntry.balance !== Number(user.balance)) {
      recent.push({
        id: 'current-balance',
        date: new Date().toISOString().slice(0, 10),
        balance: Number(user.balance) || 0,
        description: 'Current available balance'
      })
    } else if (!lastEntry && Number(user.balance) > 0) {
      recent.push({
        id: 'opening-balance',
        date: new Date().toISOString().slice(0, 10),
        balance: Number(user.balance),
        description: 'Current available balance'
      })
    }

    return recent
  }, [transactions, user.id, user.balance])

  const points = useMemo(() => {
    if (!history.length) return []
    const balances = history.map(entry => entry.balance)
    const low = Math.min(...balances)
    const high = Math.max(...balances)
    const padding = Math.max((high - low) * 0.2, high * 0.06, 1)
    const min = Math.max(0, low - padding)
    const max = high + padding
    const width = chart.right - chart.left
    const height = chart.bottom - chart.top

    return history.map((entry, index) => ({
      ...entry,
      x: history.length === 1 ? chart.left + width / 2 : chart.left + (index / (history.length - 1)) * width,
      y: chart.bottom - ((entry.balance - min) / (max - min || 1)) * height
    }))
  }, [history])

  const line = points.map(point => `${point.x},${point.y}`).join(' ')
  const area = points.length ? `${chart.left},${chart.bottom} ${line} ${chart.right},${chart.bottom}` : ''
  const latestDeposit = transactions.filter(item => item.userId === user.id && item.type === 'Deposit').reduce((sum, item) => sum + item.amount, 0)
  const latestWithdrawal = transactions.filter(item => item.userId === user.id && item.type === 'Withdrawal').reduce((sum, item) => sum + item.amount, 0)
  const gradientId = `trend-gradient-${user.id.replace(/[^a-zA-Z0-9_-]/g, '')}`

  return (
    <section className={`panel balance-trend ${className}`} aria-labelledby="balance-trend-title">
      <div className="trend-header">
        <div className="trend-title-group">
          <span className="trend-icon"><Activity size={17} /></span>
          <div>
            <h2 id="balance-trend-title">Balance history</h2>
            <p>Your balance after each account update.</p>
          </div>
        </div>
        <span className="trend-period"><span /> RECENT ACTIVITY</span>
      </div>
      {points.length ? (
        <>
          <div className="trend-chart">
            <div className="trend-axis-labels" aria-hidden="true">
              <span>{money(Math.max(...points.map(point => point.balance)))}</span>
              <span>{money(Math.min(...points.map(point => point.balance)))}</span>
            </div>
            <svg className="trend-svg" viewBox={`0 0 ${chart.width} ${chart.height}`} preserveAspectRatio="none" role="img" aria-label={`Balance history with ${points.length} points, from ${money(points[0].balance)} to ${money(points.at(-1).balance)}`}>
              <defs>
                <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#0F5A3C" stopOpacity=".2" />
                  <stop offset="100%" stopColor="#0F5A3C" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[30, 67, 104].map(y => <line key={y} className="trend-grid-line" x1={chart.left} x2={chart.right} y1={y} y2={y} />)}
              <polygon className="trend-area" points={area} fill={`url(#${gradientId})`} />
              {points.length > 1 && <polyline className="trend-line" points={line} />}
              {points.map((point, index) => (
                <g key={point.id} className={`trend-point ${index === points.length - 1 ? 'trend-point-current' : ''}`}>
                  <title>{`${prettyDate(point.date)} · ${money(point.balance)} · ${point.description}`}</title>
                  <circle className="trend-point-halo" cx={point.x} cy={point.y} r="8" />
                  <circle className="trend-point-dot" cx={point.x} cy={point.y} r={index === points.length - 1 ? 4.5 : 3.5} />
                </g>
              ))}
            </svg>
            <div className="trend-dates" aria-hidden="true">
              <span>{prettyDate(points[0].date)}</span>
              <span>{points.length > 2 ? prettyDate(points[Math.floor((points.length - 1) / 2)].date) : '\u00a0'}</span>
              <span>{points.length > 1 ? prettyDate(points.at(-1).date) : 'TODAY'}</span>
            </div>
          </div>
          <div className="trend-footer">
            <span className="trend-legend"><i /> Balance in PKR</span>
            <div className="trend-movements">
              <span><ArrowDownLeft size={13} /> <strong>{money(latestDeposit)}</strong> deposited</span>
              <span><ArrowUpRight size={13} /> <strong>{money(latestWithdrawal)}</strong> withdrawn</span>
            </div>
            <span className="trend-current"><TrendingUp size={14} /> {money(user.balance)} now</span>
          </div>
        </>
      ) : (
        <div className="trend-empty"><span><Activity size={17} /></span><div><strong>Your balance journey starts here</strong><p>Your chart will grow as you deposit and withdraw funds.</p></div></div>
      )}
    </section>
  )
}
