import { useMemo, useState } from 'react'
import { ArrowDownLeft, ArrowUpRight, CalendarDays, ChevronDown, ChevronLeft, ChevronRight, CirclePlus, Search, Wallet } from 'lucide-react'
import { getMonthActivityMap } from '../utils/activity'
import useShake from '../utils/useShake'
import { money, prettyDate } from './UI'

export function BentoGrid({ children, className = '' }) {
  return <div className={`bento-grid ${className}`}>{children}</div>
}

export function BentoCard({ children, title, subtitle, action, variant = 'default', span = 4, rows = 1, className = '' }) {
  return <section className={`bento-card bento-span-${span} bento-rows-${rows} bento-${variant} ${className}`}>
    {variant === 'hero' && <svg className="bento-contour" viewBox="0 0 420 280" preserveAspectRatio="none" aria-hidden="true"><path d="M420 4C322 3 320 64 223 63S122 16 44 46-10 142 66 148s115-34 189-3 80 88 165 75" /><path d="M420 25C328 23 321 82 224 82s-101-48-179-17-54 78 21 82 113-34 188-3 81 87 166 74" /><path d="M420 47c-90-1-98 57-194 56S123 57 47 87s-54 76 18 80 111-33 186-2 82 85 169 72" /><path d="M420 70c-87-1-96 54-191 54S127 79 52 108s-53 73 16 78 108-32 182-1 83 83 170 69" /><path d="M420 96c-84-1-94 52-186 52S131 102 58 130s-50 70 13 76 105-30 177 0 84 79 172 66" /></svg>}
    {(title || action) && <header className="bento-heading"><div>{title && <h2>{title}</h2>}{subtitle && <p>{subtitle}</p>}</div>{action}</header>}
    <div className="bento-body">{children}</div>
  </section>
}

export function IconButton({ children, label, onClick, className = '', ...props }) {
  return <button type="button" className={`icon-button icon-button-round ${className}`} aria-label={label} onClick={onClick} {...props}>{children}</button>
}

export function PillSelect({ label, value, options, onChange, className = '' }) {
  const selected = options.find(option => option.value === value)?.label || label
  return <label className={`pill-select ${className}`}><span>{selected}</span><select aria-label={label} value={value} onChange={event => onChange(event.target.value)}>{options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select><ChevronDown size={14} aria-hidden="true" /></label>
}

export function TickMeter({ value, ticks = 40, label = 'Savings health' }) {
  const filled = Math.round(Math.min(100, Math.max(0, Number(value) || 0)) / 100 * ticks)
  return <div className="tick-meter" role="img" aria-label={`${label}: ${Math.round(value)} percent`}><div className="tick-meter-bars" aria-hidden="true">{Array.from({ length: ticks }, (_, index) => <span key={index} className={index < filled ? 'tick-filled' : ''} style={{ '--tick-delay': `${index * 14}ms` }} />)}</div></div>
}

export function PillBarChart({ items, label = 'Transaction activity' }) {
  const maximum = Math.max(1, ...items.map(item => item.deposits + item.withdrawals))
  const hasActivity = items.some(item => item.deposits + item.withdrawals > 0)
  return <div className="pill-chart" role="group" aria-label={`${label}. ${items.map(item => `${item.label}: deposits ${money(item.deposits)}, withdrawals ${money(item.withdrawals)}`).join('; ')}`}>
    {hasActivity ? <div className="pill-chart-bars">{items.map((item, index) => {
      const total = item.deposits + item.withdrawals
      const height = total ? Math.max(8, total / maximum * 100) : 0
      const depositShare = total ? item.deposits / total * 100 : 0
      return <button type="button" key={item.key} className="pill-chart-column" aria-label={`${item.label}: deposits ${money(item.deposits)}, withdrawals ${money(item.withdrawals)}`} title={`${item.label} · In ${money(item.deposits)} · Out ${money(item.withdrawals)}`} style={{ '--bar-delay': `${index * 55}ms` }}>
        <span className="pill-chart-tooltip"><strong>{item.label}</strong><span className="tooltip-in">{money(item.deposits)} in</span><span className="tooltip-out">{money(item.withdrawals)} out</span></span>
        <span className="pill-chart-track"><span className="pill-chart-stack" style={{ height: `${height}%` }}><i className="pill-segment-in" style={{ height: `${depositShare}%` }} /><i className="pill-segment-out" style={{ height: `${100 - depositShare}%` }} /></span></span>
        <span className="pill-chart-label">{item.label}</span>
      </button>
    })}</div> : <div className="widget-empty"><CalendarDays size={17} /><span>No activity in this period yet.</span></div>}
    <div className="pill-chart-legend"><span><i className="legend-in" /> Deposits</span><span><i className="legend-out" /> Withdrawals</span></div>
    <table className="visually-hidden"><caption>{label}</caption><thead><tr><th>Period</th><th>Deposits</th><th>Withdrawals</th></tr></thead><tbody>{items.map(item => <tr key={item.key}><th>{item.label}</th><td>{money(item.deposits)}</td><td>{money(item.withdrawals)}</td></tr>)}</tbody></table>
  </div>
}

export function HBarList({ items, format = value => Number(value).toLocaleString(), empty = 'No comparison data yet.' }) {
  const maximum = Math.max(1, ...items.map(item => Number(item.value) || 0))
  const axes = [0, 0.5, 1].map(value => maximum * value)
  const hasData = items.some(item => Number(item.value) > 0)
  return <div className="hbar-list">{hasData ? <>{items.map(item => {
    const width = Math.max(item.value ? 2 : 0, (Number(item.value) || 0) / maximum * 100)
    return <div className="hbar-item" key={item.label}><div className="hbar-label"><span>{item.label}</span><strong>{format(item.value)}</strong></div><div className="hbar-track" role="img" aria-label={`${item.label}: ${format(item.value)}`}><span style={{ width: `${width}%` }} /></div></div>
  })}<div className="hbar-axis" aria-hidden="true">{axes.map((value, index) => <span key={index}>{format(value)}</span>)}</div></> : <div className="widget-empty"><Search size={17} /><span>{empty}</span></div>}</div>
}

export function ActivityCalendar({ transactions = [], label = 'Activity calendar' }) {
  const [month, setMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1))
  const activity = useMemo(() => getMonthActivityMap(transactions, month), [transactions, month])
  const year = month.getFullYear()
  const monthIndex = month.getMonth()
  const days = new Date(year, monthIndex + 1, 0).getDate()
  const offset = (new Date(year, monthIndex, 1).getDay() + 6) % 7
  const cells = [...Array(offset).fill(null), ...Array.from({ length: days }, (_, index) => index + 1)]
  const today = new Date()
  const monthLabel = month.toLocaleDateString('en', { month: 'long', year: 'numeric' })
  const changeMonth = delta => setMonth(current => new Date(current.getFullYear(), current.getMonth() + delta, 1))
  return <div className="activity-calendar" role="group" aria-label={label}>
    <div className="calendar-toolbar"><strong>{monthLabel}</strong><div><IconButton label="Previous month" onClick={() => changeMonth(-1)}><ChevronLeft size={17} /></IconButton><IconButton label="Next month" onClick={() => changeMonth(1)}><ChevronRight size={17} /></IconButton></div></div>
    <div className="calendar-grid">{['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => <span className="calendar-weekday" key={`${day}-${index}`} aria-hidden="true">{day}</span>)}{cells.map((day, index) => {
      if (!day) return <span key={`empty-${index}`} aria-hidden="true" />
      const key = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      const entry = activity.get(key)
      const isToday = today.getFullYear() === year && today.getMonth() === monthIndex && today.getDate() === day
      const tone = entry?.deposits && entry?.withdrawals ? 'both' : entry?.deposits ? 'deposit' : entry?.withdrawals ? 'withdrawal' : 'empty'
      const description = entry ? `${entry.count} ${entry.count === 1 ? 'transaction' : 'transactions'}, deposits ${money(entry.deposits)}, withdrawals ${money(entry.withdrawals)}` : 'No transactions'
      return <button key={key} type="button" className={`calendar-day calendar-${tone} ${isToday ? 'calendar-today' : ''}`} aria-label={`${monthLabel} ${day}: ${description}${isToday ? ', today' : ''}`} title={description}><span>{day}</span>{entry && <small>{entry.count}</small>}</button>
    })}</div>{!activity.size && <p className="calendar-empty-note">No transactions this month yet. Your activity will show here.</p>}
    <div className="calendar-legend"><span><i className="legend-in" /> Deposit</span><span><i className="legend-out" /> Withdrawal</span><span><i className="legend-both" /> Both</span></div>
  </div>
}

export function QuickDeposit({ transact, notify }) {
  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')
  const { shaking, triggerShake } = useShake()
  const submit = event => {
    event.preventDefault()
    const result = transact('Deposit', amount, new Date().toISOString().slice(0, 10), 'Quick dashboard deposit')
    if (result.error) {
      setError(result.error)
      triggerShake()
      return
    }
    setAmount('')
    setError('')
    notify(`Deposit of PKR ${Number(amount).toLocaleString()} completed successfully.`)
  }
  return <form className={`quick-deposit-form ${shaking ? 'shake' : ''}`} onSubmit={submit}><label htmlFor="quick-deposit-amount" className="visually-hidden">Quick deposit amount in PKR</label><div className="quick-deposit-input"><span>PKR</span><input id="quick-deposit-amount" type="number" inputMode="decimal" min="1" step="1" required placeholder="0" value={amount} onChange={event => setAmount(event.target.value)} /><IconButton label="Submit deposit" type="submit"><CirclePlus size={23} /></IconButton></div>{error && <p className="inline-error" role="alert">{error}</p>}<button className="button button-primary full-button" type="submit"><CirclePlus size={17} /> Add money</button></form>
}

export function RecentActivityList({ transactions, emptyLabel = 'Your recent transactions will appear here.' }) {
  if (!transactions.length) return <div className="widget-empty"><Wallet size={18} /><span>{emptyLabel}</span></div>
  return <div className="recent-activity-list">{transactions.map(transaction => {
    const deposit = transaction.type === 'Deposit'
    const Icon = deposit ? ArrowDownLeft : ArrowUpRight
    return <div className="activity-row" key={transaction.id}><span className={`activity-avatar ${deposit ? 'activity-deposit' : 'activity-withdrawal'}`}><Icon size={16} /></span><span className="activity-description"><strong>{transaction.description}</strong><small>{prettyDate(transaction.date)} · {transaction.type}</small></span><strong className={`activity-amount ${deposit ? 'amount-in' : 'amount-out'}`}>{deposit ? '+' : '−'}{money(transaction.amount)}</strong></div>
  })}</div>
}
