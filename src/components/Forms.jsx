import { useState } from 'react'
import { ArrowDownLeft, ArrowUpRight, Check, Eye, EyeOff } from 'lucide-react'
import { Modal } from './UI'
import useShake from '../utils/useShake'

export function BankingForm({ type, user, transact, notify }) {
  const deposit = type === 'Deposit'
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const { shaking, triggerShake } = useShake()
  const submit = event => {
    event.preventDefault()
    const result = transact(type, amount, date, description)
    if (result.error) { setError(result.error); triggerShake(); return }
    setError(''); setAmount(''); setDescription('')
    notify(`${deposit ? 'Deposit' : 'Withdrawal'} of PKR ${Number(amount).toLocaleString()} completed successfully.`)
  }
  return <form className={`form-stack ${shaking ? 'shake' : ''}`} onSubmit={submit}>
    {!deposit && <div className="available-balance"><span>Available balance</span><strong>PKR {Number(user.balance).toLocaleString()}</strong></div>}
    <label className="field-label">Amount (PKR)<div className="input-with-prefix amount-input-group"><span aria-hidden="true">Rs.</span><input type="number" min="1" step="1" required placeholder="0.00" value={amount} onChange={event => setAmount(event.target.value)} /></div></label>
    <div className="form-two-col"><label className="field-label">Date<input type="date" required value={date} max={new Date().toISOString().slice(0, 10)} onChange={event => setDate(event.target.value)} /></label><label className="field-label">Description<input maxLength="80" placeholder={deposit ? 'e.g. Monthly salary' : 'e.g. Utility bill'} value={description} onChange={event => setDescription(event.target.value)} /></label></div>
    {error && <div className="inline-error">{error}</div>}
    <button className={`button ${deposit ? 'button-primary' : 'button-dark'} full-button`} type="submit">{deposit ? <ArrowDownLeft size={17} /> : <ArrowUpRight size={17} />}{deposit ? 'Deposit funds' : 'Withdraw funds'}</button>
  </form>
}

export function UserForm({ initial = {}, onSubmit, onCancel, submitLabel = 'Save changes' }) {
  const [fields, setFields] = useState({
    name: initial.name || '', email: initial.email || '', phone: initial.phone || '',
    cnic: initial.cnic || '', accountType: initial.accountType || 'Savings',
    balance: initial.balance ?? 0, status: initial.status || 'Active',
    password: initial.password || '', accountNumber: initial.accountNumber || ''
  })
  const [error, setError] = useState('')
  const { shaking, triggerShake } = useShake()
  const change = event => setFields({ ...fields, [event.target.name]: event.target.value })
  const submit = event => {
    event.preventDefault()
    if (fields.name.trim().length < 2) { setError('Please enter the account holder’s full name.'); triggerShake(); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) { setError('Enter a valid email address.'); triggerShake(); return }
    if (!initial.id && fields.password.length < 6) { setError('Password must be at least 6 characters.'); triggerShake(); return }
    if (!/^[+()\d\s-]{7,20}$/.test(fields.phone)) { setError('Enter a valid phone number.'); triggerShake(); return }
    const result = onSubmit({ ...fields, balance: Number(fields.balance), password: fields.password || initial.password || 'welcome123' })
    if (result?.error) { setError(result.error); triggerShake() }
  }
  return <form className={`form-stack ${shaking ? 'shake' : ''}`} onSubmit={submit}>
    <div className="form-two-col"><label className="field-label">Full name<input name="name" required value={fields.name} onChange={change} placeholder="e.g. Ayesha Khan" /></label><label className="field-label">Email address<input name="email" type="email" required value={fields.email} onChange={change} placeholder="name@email.com" /></label>
    <label className="field-label">Phone number<input name="phone" required value={fields.phone} onChange={change} placeholder="+92 300 1234567" /></label><label className="field-label">CNIC / national ID<input name="cnic" value={fields.cnic} onChange={change} placeholder="35202-1234567-1" /></label>
    <label className="field-label">Account type<select name="accountType" value={fields.accountType} onChange={change}><option>Savings</option><option>Current</option><option>Premium</option></select></label>
    <label className="field-label">Opening balance (PKR)<input name="balance" type="number" min="0" value={fields.balance} onChange={change} /></label>
    {!initial.id && <label className="field-label">Temporary password<input name="password" type="password" minLength="6" required value={fields.password} onChange={change} placeholder="At least 6 characters" /></label>}
    {initial.id && <label className="field-label">Account status<select name="status" value={fields.status} onChange={change}><option>Active</option><option>Blocked</option><option>Closed</option></select></label>}</div>
    {error && <div className="inline-error">{error}</div>}
    <div className="modal-actions"><button className="button button-secondary" type="button" onClick={onCancel}>Cancel</button><button className="button button-primary" type="submit"><Check size={16} />{submitLabel}</button></div>
  </form>
}

export function AccountForm({ account = {}, users, onSubmit, onCancel }) {
  const [fields, setFields] = useState({
    userId: account.userId || users.find(user => user.role === 'user')?.id || '',
    accountNumber: account.accountNumber || '', type: account.type || 'Savings',
    balance: account.balance ?? 0, status: account.status || 'Active'
  })
  const [error, setError] = useState('')
  const { shaking, triggerShake } = useShake()
  const change = event => setFields({ ...fields, [event.target.name]: event.target.value })
  const submit = event => {
    event.preventDefault()
    const result = onSubmit({ ...fields, balance: Number(fields.balance) })
    if (result?.error) { setError(result.error); triggerShake() }
  }
  return <form className={`form-stack ${shaking ? 'shake' : ''}`} onSubmit={submit}><div className="form-two-col">
    <label className="field-label">Account holder<select name="userId" value={fields.userId} onChange={change} disabled={Boolean(account.id)}>{users.filter(user => user.role === 'user').map(user => <option key={user.id} value={user.id}>{user.name} · {user.email}</option>)}</select></label>
    <label className="field-label">Account number<input name="accountNumber" value={fields.accountNumber} onChange={change} placeholder="Auto-generated if blank" /></label>
    <label className="field-label">Account type<select name="type" value={fields.type} onChange={change}><option>Savings</option><option>Current</option><option>Premium</option></select></label>
    <label className="field-label">Balance (PKR)<input name="balance" type="number" min="0" value={fields.balance} onChange={change} /></label>
    <label className="field-label">Account status<select name="status" value={fields.status} onChange={change}><option>Active</option><option>Blocked</option><option>Closed</option></select></label>
  </div>{error && <div className="inline-error">{error}</div>}<div className="modal-actions"><button className="button button-secondary" type="button" onClick={onCancel}>Cancel</button><button className="button button-primary" type="submit"><Check size={16} />Save account</button></div></form>
}

export function ProfileForm({ user, updateUser, notify }) {
  const [fields, setFields] = useState({ name: user.name, email: user.email, phone: user.phone, password: '' })
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { shaking, triggerShake } = useShake()
  const change = event => setFields({ ...fields, [event.target.name]: event.target.value })
  const submit = event => {
    event.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) { setError('Enter a valid email address.'); triggerShake(); return }
    if (!/^[+()\d\s-]{7,20}$/.test(fields.phone)) { setError('Enter a valid phone number.'); triggerShake(); return }
    if (fields.password && fields.password.length < 6) { setError('New password must be at least 6 characters.'); triggerShake(); return }
    const updates = { name: fields.name.trim(), email: fields.email.trim(), phone: fields.phone.trim() }
    if (fields.password) updates.password = fields.password
    const result = updateUser(user.id, updates)
    if (result.error) { setError(result.error); triggerShake(); return }
    setError(''); setFields(current => ({ ...current, password: '' })); notify('Your profile has been updated.')
  }
  return <form className={`form-stack profile-form ${shaking ? 'shake' : ''}`} onSubmit={submit}>
    <label className="field-label">Full name<input name="name" required value={fields.name} onChange={change} /></label>
    <label className="field-label">Email address<input name="email" type="email" required value={fields.email} onChange={change} /></label>
    <label className="field-label">Phone number<input name="phone" required value={fields.phone} onChange={change} /></label>
    <label className="field-label">New password <span className="optional-label">Leave blank to keep current</span><div className="password-wrap"><input name="password" type={showPassword ? 'text' : 'password'} value={fields.password} onChange={change} minLength="6" placeholder="Enter a new password" /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label="Toggle password visibility">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></div></label>
    {error && <div className="inline-error">{error}</div>}<button type="submit" className="button button-primary"><Check size={16} />Save profile</button>
  </form>
}

export function UserModal({ user, createUser, updateUser, onClose, onSaved }) {
  return <Modal title={user ? 'Edit user' : 'Add a new user'} subtitle={user ? 'Update this account holder’s information.' : 'Create a customer profile and bank account.'} onClose={onClose}>
    {requestClose => <UserForm initial={user || {}} submitLabel={user ? 'Save changes' : 'Create user'} onCancel={requestClose}
      onSubmit={fields => { const result = user ? updateUser(user.id, fields) : createUser(fields); if (!result.error) onSaved(user ? 'User details updated.' : 'New user and account created.', requestClose); return result }} />}
  </Modal>
}
