export const money = value => new Intl.NumberFormat('en-PK', {
  style: 'currency',
  currency: 'PKR',
  maximumFractionDigits: 0
}).format(Number(value) || 0)

export const prettyDate = value => value
  ? new Date(`${value}T00:00:00`).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  : '—'
