import { useEffect, useState } from 'react'
import { ArrowDownLeft, ArrowUpRight, ChevronLeft, ChevronRight, Search, X } from 'lucide-react'
import { money, prettyDate } from '../utils/format'
import useCountUp from '../utils/useCountUp'

export { money, prettyDate } from '../utils/format'

export function AnimatedNumber({ value, format = number => Math.round(number).toLocaleString(), duration = 850, className }) {
  const count = useCountUp(value, duration)
  return <span className={className}>{format(count)}</span>
}

export function AnimatedCheck({ className = '' }) {
  return <svg className={`animated-check ${className}`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle className="check-circle-path" cx="12" cy="12" r="10" />
    <path className="check-tick-path" d="m7.5 12.4 3 3 6.4-6.7" />
  </svg>
}

export function ProgressRing({ value, size = 68, label = 'Active' }) {
  const progress = useCountUp(value, 850)
  const radius = 25
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - Math.min(100, Math.max(0, progress)) / 100)
  return <div className="progress-ring" style={{ width: size, height: size }} role="img" aria-label={`${Math.round(value)}% ${label.toLowerCase()}`}>
    <svg viewBox="0 0 60 60" aria-hidden="true"><circle className="ring-track" cx="30" cy="30" r={radius} /><circle className="ring-progress" cx="30" cy="30" r={radius} strokeDasharray={circumference} strokeDashoffset={offset} /></svg>
    <span className="progress-ring-label"><strong>{Math.round(progress)}%</strong><small>{label}</small></span>
  </div>
}

export function AnimatedDonut({ items, size = 118 }) {
  const [ready, setReady] = useState(false)
  const total = items.reduce((sum, item) => sum + item.value, 0)
  const radius = 24
  const circumference = 2 * Math.PI * radius
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setReady(true))
    return () => window.cancelAnimationFrame(frame)
  }, [])

  let offset = 0
  const segments = items.map(item => {
    const segment = total ? (item.value / total) * circumference : 0
    const dashOffset = offset
    offset += segment
    return { ...item, segment, dashOffset }
  })
  return <svg className="animated-donut" width={size} height={size} viewBox="0 0 60 60" role="img" aria-label={`Account mix: ${items.map(item => `${item.label} ${total ? Math.round(item.value / total * 100) : 0}%`).join(', ')}`}>
    <circle className="ring-track" cx="30" cy="30" r={radius} />
    {segments.map(item => <circle key={item.label} className={`donut-segment ${ready ? 'donut-ready' : ''}`} cx="30" cy="30" r={radius} stroke={item.color} strokeDasharray={`${ready ? item.segment : 0} ${circumference}`} strokeDashoffset={-item.dashOffset} />)}
  </svg>
}

export function Toast({ notice, onClose }) {
  if (!notice) return null
  return <div className={`toast toast-${notice.type}`} role={notice.type === 'error' ? 'alert' : 'status'} aria-live={notice.type === 'error' ? 'assertive' : 'polite'}><span className="toast-check">{notice.type === 'error' ? <X size={15} /> : <AnimatedCheck />}</span><span className="toast-message">{notice.message}</span><button onClick={onClose} aria-label="Dismiss"><X size={16} /></button><span className="toast-progress" key={`${notice.message}-${notice.type}`} aria-hidden="true" /></div>
}

export function Modal({ title, subtitle, onClose, children, wide = false }) {
  const [closing, setClosing] = useState(false)
  const requestClose = () => {
    if (closing) return
    setClosing(true)
    window.setTimeout(onClose, 190)
  }
  const content = typeof children === 'function' ? children(requestClose) : children
  return <div className={`modal-backdrop ${closing ? 'modal-backdrop-exit' : ''}`} onMouseDown={event => event.target === event.currentTarget && requestClose()}>
    <section className={`modal-card ${wide ? 'modal-wide' : ''} ${closing ? 'modal-card-exit' : ''}`} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <header className="modal-heading"><div><h2 id="modal-title">{title}</h2>{subtitle && <p>{subtitle}</p>}</div><button className="icon-button" onClick={requestClose} aria-label="Close"><X size={18} /></button></header>
      {content}
    </section>
  </div>
}

export function StatCard({ label, value, detail, icon: Icon, tone = 'green' }) {
  return <article className="stat-card"><div className={`stat-icon tone-${tone}`}><Icon size={19} /></div><div className="stat-label">{label}</div><strong className="stat-value">{value}</strong>{detail && <div className="stat-detail">{detail}</div>}</article>
}

export function PageHeading({ eyebrow, title, description, action }) {
  return <div className="page-heading"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1>{description && <p>{description}</p>}</div>{action && <div className="heading-action">{action}</div>}</div>
}

export function SearchBox({ value, onChange, placeholder = 'Search...' }) {
  return <label className="search-box"><Search size={17} /><input value={value} onChange={event => onChange(event.target.value)} placeholder={placeholder} /></label>
}

export function Badge({ children, variant }) {
  const type = variant || String(children).toLowerCase().replace(/\s+/g, '-')
  return <span className={`badge badge-${type}`}>{children}</span>
}

export function TransactionRows({ transactions, compact = false, onDelete, exitingIds = new Set() }) {
  if (!transactions.length) return <div className="empty-state"><div className="empty-mark">↗</div><strong>No transactions found</strong><p>Try adjusting your filters or check back later.</p></div>
  return <div className="table-scroll"><table><thead><tr><th>Transaction</th>{!compact && <th>Account holder</th>}<th>Type</th><th>Amount</th><th>Date</th><th>Description</th>{!compact && <th>Balance</th>}{onDelete && <th></th>}</tr></thead>
    <tbody className="stagger-children">{transactions.map(transaction => <tr key={transaction.id} className={exitingIds.has(transaction.id) ? 'row-exit' : ''}><td><span className="txn-id">{transaction.id}</span></td>{!compact && <td><span className="person-cell"><span className="avatar avatar-small">{transaction.userName?.split(' ').map(part => part[0]).slice(0, 2).join('')}</span>{transaction.userName}</span></td>}
      <td><span className={`txn-type ${transaction.type === 'Deposit' ? 'txn-in' : 'txn-out'}`}>{transaction.type === 'Deposit' ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}{transaction.type}</span></td>
      <td className={`amount-cell ${transaction.type === 'Deposit' ? 'amount-in' : ''}`}>{transaction.type === 'Deposit' ? '+' : '−'}{money(transaction.amount)}</td>
      <td>{prettyDate(transaction.date)}</td><td className="description-cell">{transaction.description}</td>{!compact && <td>{money(transaction.balance)}</td>}
      {onDelete && <td><button className="text-action danger-text" onClick={() => onDelete(transaction)} aria-label={`Delete ${transaction.id}`}>Delete</button></td>}</tr>)}</tbody></table></div>
}

export function DataTable({ columns, rows, empty = 'Nothing to show yet.', exitingIds = new Set() }) {
  return <div className="table-scroll"><table><thead><tr>{columns.map(column => <th key={column.key}>{column.label}</th>)}</tr></thead><tbody className="stagger-children">{rows.length ? rows.map(row => <tr key={row.id} className={exitingIds.has(row.id) ? 'row-exit' : ''}>{columns.map(column => <td key={column.key}>{column.render ? column.render(row) : row[column.key]}</td>)}</tr>) : <tr><td colSpan={columns.length}><div className="table-empty">{empty}</div></td></tr>}</tbody></table></div>
}

export function TransactionTable({ transactions, admin = false, onDelete, exitingIds }) {
  return <TransactionRows transactions={transactions} compact={!admin} onDelete={onDelete} exitingIds={exitingIds} />
}

export function Pagination({ page, setPage, total, pageSize = 7 }) {
  const pages = Math.max(1, Math.ceil(total / pageSize))
  if (total <= pageSize) return null
  return <div className="pagination"><span>Showing {Math.min((page - 1) * pageSize + 1, total)}–{Math.min(page * pageSize, total)} of {total}</span><div><button disabled={page === 1} onClick={() => setPage(page - 1)} aria-label="Previous page"><ChevronLeft size={16} /></button><span>{page} / {pages}</span><button disabled={page === pages} onClick={() => setPage(page + 1)} aria-label="Next page"><ChevronRight size={16} /></button></div></div>
}

export function usePaged(items, pageSize = 7) {
  const [page, setPage] = useState(1)
  const visible = items.slice((page - 1) * pageSize, page * pageSize)
  return { page, setPage, visible, pageSize }
}
