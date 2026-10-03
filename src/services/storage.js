import { starterTransactions, starterUsers } from '../data/seed'

const read = (key, fallback) => {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch (error) {
    console.error(`Unable to read ${key} from localStorage`, error)
    return fallback
  }
}

export const loadBankState = () => {
  const users = read('evergreen_users', starterUsers)
  const accounts = read('evergreen_accounts', users.filter(user => user.role === 'user').map(user => ({
    id: `account-${user.id}`, userId: user.id, accountNumber: user.accountNumber,
    type: user.accountType, balance: user.balance, status: user.status || 'Active'
  })))
  return {
    users,
    accounts,
    transactions: read('evergreen_transactions', starterTransactions),
    currentUserId: read('evergreen_current_user', null)
  }
}

export const saveBankState = ({ users, accounts, transactions, currentUserId }) => {
  try {
    localStorage.setItem('evergreen_users', JSON.stringify(users))
    localStorage.setItem('evergreen_accounts', JSON.stringify(accounts))
    localStorage.setItem('evergreen_transactions', JSON.stringify(transactions))
    if (currentUserId) localStorage.setItem('evergreen_current_user', JSON.stringify(currentUserId))
    else localStorage.removeItem('evergreen_current_user')
  } catch (error) {
    console.error('Unable to save banking data to localStorage', error)
    throw new Error('Your changes could not be saved in this browser.')
  }
}
