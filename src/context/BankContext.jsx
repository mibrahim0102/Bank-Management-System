import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { loadBankState, saveBankState } from '../services/storage'

const BankContext = createContext(null)
const makeId = prefix => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

export function BankProvider({ children }) {
  const [state, setState] = useState(loadBankState)
  const [notice, setNotice] = useState(null)
  useEffect(() => {
    try {
      saveBankState(state)
    } catch (error) {
      setNotice({ message: error.message, type: 'error' })
    }
  }, [state])
  useEffect(() => {
    if (!notice) return undefined
    const timer = setTimeout(() => setNotice(null), 3600)
    return () => clearTimeout(timer)
  }, [notice])

  const currentUser = state.users.find(user => user.id === state.currentUserId) || null
  const notify = (message, type = 'success') => setNotice({ message, type })
  const dismissNotice = () => setNotice(null)
  const login = (email, password) => {
    const user = state.users.find(item => item.email.toLowerCase() === email.trim().toLowerCase() && item.password === password)
    if (!user) return { error: 'That email and password combination was not found.' }
    if (user.role === 'user' && user.status !== 'Active') return { error: `This account is ${user.status.toLowerCase()}. Please contact your bank.` }
    setState(previous => ({ ...previous, currentUserId: user.id }))
    return { user }
  }
  const logout = () => setState(previous => ({ ...previous, currentUserId: null }))
  const register = fields => {
    if (state.users.some(user => user.email.toLowerCase() === fields.email.toLowerCase())) return { error: 'An account with this email already exists.' }
    const id = makeId('user')
    const accountNumber = `ACC${String(Date.now()).slice(-7)}`
    const { confirmPassword, ...profile } = fields
    const user = { ...profile, id, role: 'user', accountNumber, balance: 0, status: 'Active' }
    setState(previous => ({
      ...previous, users: [...previous.users, user],
      accounts: [...previous.accounts, { id: makeId('account'), userId: id, accountNumber, type: user.accountType, balance: 0, status: 'Active' }],
      currentUserId: id
    }))
    return { user }
  }
  const createUser = fields => {
    if (state.users.some(user => user.email.toLowerCase() === fields.email.toLowerCase())) return { error: 'This email is already registered.' }
    const id = makeId('user')
    const accountNumber = fields.accountNumber || `ACC${String(Date.now()).slice(-7)}`
    const user = { ...fields, id, role: 'user', accountNumber, balance: Number(fields.balance) || 0, status: fields.status || 'Active' }
    setState(previous => ({
      ...previous, users: [...previous.users, user],
      accounts: [...previous.accounts, { id: makeId('account'), userId: id, accountNumber, type: user.accountType, balance: user.balance, status: user.status }]
    }))
    return { user }
  }
  const updateUser = (id, updates) => {
    if (state.users.some(user => user.id !== id && user.email.toLowerCase() === (updates.email || '').toLowerCase())) return { error: 'That email is already in use.' }
    setState(previous => {
      const users = previous.users.map(user => user.id === id ? { ...user, ...updates } : user)
      const target = users.find(user => user.id === id)
      return {
        ...previous, users,
        accounts: previous.accounts.map(account => account.userId === id && account.accountNumber === previous.users.find(user => user.id === id)?.accountNumber ? {
          ...account, type: target.accountType, accountNumber: target.accountNumber, balance: Number(target.balance), status: target.status
        } : account)
      }
    })
    return { ok: true }
  }
  const deleteUser = id => setState(previous => ({
    ...previous, users: previous.users.filter(user => user.id !== id),
    accounts: previous.accounts.filter(account => account.userId !== id),
    transactions: previous.transactions.filter(transaction => transaction.userId !== id),
    currentUserId: previous.currentUserId === id ? null : previous.currentUserId
  }))
  const createAccount = (userId, fields) => {
    const user = state.users.find(item => item.id === userId)
    if (!user) return { error: 'Select an existing user for this account.' }
    const number = fields.accountNumber || `ACC${String(Date.now()).slice(-7)}`
    if (state.accounts.some(account => account.accountNumber === number)) return { error: 'That account number is already in use.' }
    const account = { ...fields, id: makeId('account'), userId, accountNumber: number, balance: Number(fields.balance) || 0, type: fields.type || user.accountType, status: fields.status || 'Active' }
    setState(previous => ({ ...previous, accounts: [...previous.accounts, account] }))
    return { ok: true }
  }
  const updateAccount = (id, updates) => {
    const account = state.accounts.find(item => item.id === id)
    if (!account) return { error: 'Account could not be found.' }
    if (updates.accountNumber && state.accounts.some(item => item.id !== id && item.accountNumber === updates.accountNumber)) return { error: 'That account number is already in use.' }
    if (Number(updates.balance ?? account.balance) < 0) return { error: 'Account balance cannot be negative.' }
    setState(previous => ({
      ...previous,
      accounts: previous.accounts.map(item => item.id === id ? { ...item, ...updates, balance: Number(updates.balance ?? item.balance) } : item),
      users: previous.users.map(user => user.id === account.userId && user.accountNumber === account.accountNumber ? {
        ...user, accountNumber: updates.accountNumber ?? user.accountNumber, accountType: updates.type ?? user.accountType,
        balance: Number(updates.balance ?? user.balance), status: updates.status ?? user.status
      } : user)
    }))
    return { ok: true }
  }
  const deleteAccount = id => {
    const account = state.accounts.find(item => item.id === id)
    if (!account) return
    setState(previous => ({
      ...previous,
      accounts: previous.accounts.filter(item => item.id !== id),
      users: previous.users.map(user => user.id === account.userId && user.accountNumber === account.accountNumber ? { ...user, accountNumber: '—', balance: 0, status: 'Closed' } : user)
    }))
  }
  const transact = (type, amount, date, description, userId = currentUser?.id) => {
    const user = state.users.find(item => item.id === userId)
    const value = Number(amount)
    if (!user || user.role !== 'user') return { error: 'Select a valid account.' }
    if (!Number.isFinite(value) || value <= 0) return { error: 'Enter an amount greater than zero.' }
    if (user.status !== 'Active') return { error: 'This account is not active.' }
    if (type === 'Withdrawal' && value > user.balance) return { error: 'Insufficient funds. Please check your available balance.' }
    const balance = Math.round((user.balance + (type === 'Deposit' ? value : -value)) * 100) / 100
    const transaction = {
      id: makeId(`TXN-${Date.now().toString().slice(-8)}`), userId: user.id, userName: user.name,
      accountNumber: user.accountNumber, type, amount: value, date, description: description.trim() || `${type} transaction`, balance
    }
    setState(previous => ({
      ...previous,
      users: previous.users.map(item => item.id === user.id ? { ...item, balance } : item),
      accounts: previous.accounts.map(item => item.userId === user.id && item.accountNumber === user.accountNumber ? { ...item, balance } : item),
      transactions: [transaction, ...previous.transactions]
    }))
    return { transaction }
  }
  const deleteTransaction = id => setState(previous => ({ ...previous, transactions: previous.transactions.filter(item => item.id !== id) }))

  const value = useMemo(() => ({
    ...state, currentUser, notice, notify, dismissNotice, login, logout, register, createUser, updateUser, deleteUser,
    createAccount, updateAccount, deleteAccount, transact, deleteTransaction
  }), [state, currentUser, notice])
  return <BankContext.Provider value={value}>{children}</BankContext.Provider>
}

export const useBank = () => {
  const context = useContext(BankContext)
  if (!context) throw new Error('useBank must be used within BankProvider')
  return context
}
