const dateKey = date => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const dateFromKey = value => {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

const startOfWeek = date => {
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7))
  return start
}

const summarize = transactions => transactions.reduce((summary, transaction) => {
  const type = transaction.type === 'Deposit' ? 'deposits' : 'withdrawals'
  summary[type] += Number(transaction.amount) || 0
  summary.count += 1
  return summary
}, { deposits: 0, withdrawals: 0, count: 0 })

export function getWeeklyActivity(transactions, now = new Date()) {
  const start = startOfWeek(now)
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(start)
    date.setDate(start.getDate() + index)
    const key = dateKey(date)
    return { key, label: date.toLocaleDateString('en', { weekday: 'short' }), ...summarize(transactions.filter(item => item.date === key)) }
  })
}

export function getMonthlyActivity(transactions, now = new Date()) {
  const year = now.getFullYear()
  const month = now.getMonth()
  const first = new Date(year, month, 1)
  const weeks = Math.ceil((first.getDay() + new Date(year, month + 1, 0).getDate()) / 7)
  return Array.from({ length: weeks }, (_, index) => {
    const from = new Date(year, month, 1 + index * 7)
    const through = new Date(year, month, Math.min(1 + (index + 1) * 7, new Date(year, month + 1, 0).getDate()))
    const bucket = transactions.filter(item => {
      const date = dateFromKey(item.date)
      return date >= from && date <= through
    })
    return { key: `week-${index + 1}`, label: `W${index + 1}`, ...summarize(bucket) }
  })
}

export function getMonthActivityMap(transactions, monthDate = new Date()) {
  const year = monthDate.getFullYear()
  const month = monthDate.getMonth()
  const activity = new Map()
  transactions.forEach(transaction => {
    const date = dateFromKey(transaction.date)
    if (date.getFullYear() !== year || date.getMonth() !== month) return
    const current = activity.get(transaction.date) || { deposits: 0, withdrawals: 0, count: 0 }
    const type = transaction.type === 'Deposit' ? 'deposits' : 'withdrawals'
    current[type] += Number(transaction.amount) || 0
    current.count += 1
    activity.set(transaction.date, current)
  })
  return activity
}

export function getAccountTypeBalances(accounts) {
  const types = ['Savings', 'Current', 'Premium']
  return types.map(type => ({
    label: type,
    value: accounts.filter(account => account.type === type).length,
    amount: accounts.filter(account => account.type === type).reduce((sum, account) => sum + (Number(account.balance) || 0), 0)
  }))
}

export function getTopBalances(users, limit = 5) {
  return users.filter(user => user.role === 'user')
    .map(user => ({ label: user.name, value: Number(user.balance) || 0 }))
    .sort((left, right) => right.value - left.value)
    .slice(0, limit)
}
