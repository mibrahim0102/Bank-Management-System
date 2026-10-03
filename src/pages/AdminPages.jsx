import { useMemo, useState } from 'react'
import { Activity, ArrowDownLeft, ArrowRight, ArrowUpRight, Banknote, CreditCard, Download, MoreHorizontal, Plus, Search, ShieldCheck, TrendingUp, Users, Wallet } from 'lucide-react'
import { ProfileForm, UserModal } from '../components/Forms'
import { AccountFormModal } from './AdminShared'
import { AnimatedDonut, AnimatedNumber, Badge, DataTable, Modal, PageHeading, Pagination, ProgressRing, SearchBox, StatCard, TransactionTable, money, prettyDate, usePaged } from '../components/UI'
import { ActivityCalendar, BentoCard, BentoGrid, HBarList, PillBarChart, PillSelect, RecentActivityList, TickMeter } from '../components/BentoWidgets'
import { useBank } from '../context/BankContext'
import useExitAnimation from '../utils/useExitAnimation'
import { getAccountTypeBalances, getMonthlyActivity, getTopBalances, getWeeklyActivity } from '../utils/activity'
import { Link } from 'react-router-dom'

const adminToday = new Intl.DateTimeFormat('en', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(new Date()).toUpperCase()
const adminGreeting = new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'

export function AdminWelcome() {
  const { users, accounts, transactions } = useBank()
  const [period, setPeriod] = useState('weekly')
  const customers = users.filter(user => user.role === 'user')
  const deposits = transactions.filter(item => item.type === 'Deposit').reduce((sum, item) => sum + item.amount, 0)
  const withdrawals = transactions.filter(item => item.type === 'Withdrawal').reduce((sum, item) => sum + item.amount, 0)
  const totalBalance = customers.reduce((sum, item) => sum + Number(item.balance), 0)
  const active = customers.filter(user => user.status === 'Active').length
  const recent = [...transactions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5)
  const activePercent = customers.length ? active / customers.length * 100 : 0
  const activity = period === 'weekly' ? getWeeklyActivity(transactions) : getMonthlyActivity(transactions)
  const accountMix = getAccountTypeBalances(accounts)
  const topCustomers = getTopBalances(customers)
  return <><div className="welcome-row bento-welcome"><div><div className="eyebrow">{adminToday}</div><h1>Good {adminGreeting}, Admin <span className="wave">✳</span></h1><p>A clear picture of the whole bank, all in one place.</p></div><div className="welcome-secure"><Activity size={15} /> Live system overview</div></div>
    <BentoGrid className="admin-bento">
      <BentoCard variant="hero" span={8} rows={2} className="admin-hero-card">
        <div className="hero-kicker"><Wallet size={15} /> TOTAL BANK BALANCE <span className="hero-demo-pill">DEMO OVERVIEW</span></div>
        <div className="hero-balance"><strong><AnimatedNumber value={totalBalance} format={money} /></strong><span>Across {accounts.length} customer accounts</span></div>
        <div className="admin-hero-meta"><span><strong><AnimatedNumber value={customers.length} /></strong> Customers</span><span><strong><AnimatedNumber value={deposits} format={money} /></strong> Deposits</span><span><strong><AnimatedNumber value={withdrawals} format={money} /></strong> Withdrawals</span></div>
        <div className="hero-actions"><Link className="button hero-button-light" to="/admin/users">Add customer <ArrowRight size={15} /></Link><Link className="button hero-button-outline" to="/admin/accounts">Add account <ArrowRight size={15} /></Link></div>
      </BentoCard>
      <BentoCard title="Active accounts" subtitle="Current customer availability." span={4} className="admin-health-bento">
        <div className="admin-health-value"><strong><AnimatedNumber value={activePercent} format={value => `${Math.round(value)}%`} /></strong><span>of customer profiles are active</span></div>
        <TickMeter value={activePercent} label="Active customer account share" />
        <div className="health-note"><span>{active} active</span><span>{customers.length - active} need attention</span></div>
      </BentoCard>
      <BentoCard title="Bank activity" subtitle="Deposit and withdrawal volume." span={6} rows={2} className="admin-weekly-bento" action={<PillSelect label="Activity period" value={period} options={[{ value: 'weekly', label: 'Weekly' }, { value: 'monthly', label: 'Monthly' }]} onChange={setPeriod} />}>
        <PillBarChart items={activity} label={`Bank-wide ${period} deposits and withdrawals`} />
      </BentoCard>
      <BentoCard title="Activity calendar" subtitle="Bank-wide transaction days." span={6} rows={2} className="admin-calendar-bento">
        <ActivityCalendar transactions={transactions} label="Bank-wide monthly transaction calendar" />
      </BentoCard>
      <BentoCard title="Account-type mix" subtitle="Accounts by type." span={6} className="account-mix-bento">
        <HBarList items={accountMix.map(item => ({ label: item.label, value: item.value }))} format={value => `${value} ${value === 1 ? 'account' : 'accounts'}`} empty="No accounts to compare yet." />
      </BentoCard>
      <BentoCard title="Top customer balances" subtitle="Highest current balances." span={6} className="top-customer-bento">
        <HBarList items={topCustomers} format={money} empty="No customers to compare yet." />
      </BentoCard>
      <BentoCard title="Recent transactions" subtitle="Latest activity across the bank." span={12} className="admin-recent-bento" action={<Link to="/admin/transactions" className="button button-secondary button-pill">View all <ArrowRight size={14} /></Link>}>
        <RecentActivityList transactions={recent} emptyLabel="Bank transactions will appear here as customers make deposits and withdrawals." />
      </BentoCard>
    </BentoGrid>
  </>
}

function UserDetails({ user, onClose }) {
  const { transactions, accounts } = useBank()
  const mine = transactions.filter(item => item.userId === user.id).slice(0, 5)
  const account = accounts.find(item => item.userId === user.id)
  return <Modal title="Customer profile" subtitle="Account holder details and recent activity." onClose={onClose} wide>{requestClose => <><div className="user-detail-hero"><span className="avatar avatar-large">{user.name.split(' ').map(part => part[0]).slice(0, 2).join('')}</span><div><h3>{user.name}</h3><p>{user.email}</p></div><Badge>{user.status}</Badge></div><div className="detail-grid"><div><span>Phone number</span><strong>{user.phone}</strong></div><div><span>CNIC</span><strong>{user.cnic || 'Not provided'}</strong></div><div><span>Account number</span><strong>{account?.accountNumber || '—'}</strong></div><div><span>Account type</span><strong>{account?.type || user.accountType}</strong></div><div><span>Available balance</span><strong>{money(account?.balance ?? user.balance)}</strong></div><div><span>Role</span><strong>Customer</strong></div></div><h3 className="modal-section-title">Recent transactions</h3><TransactionTable transactions={mine} /><div className="modal-actions"><button className="button button-secondary" onClick={requestClose}>Close</button></div></>}</Modal>
}

export function UsersPage() {
  const { users, createUser, updateUser, deleteUser, notify } = useBank()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All statuses')
  const [modal, setModal] = useState(null)
  const [details, setDetails] = useState(null)
  const { exitingIds, removeWithExit } = useExitAnimation()
  const customers = users.filter(user => user.role === 'user')
  const filtered = customers.filter(user => `${user.id} ${user.name} ${user.email} ${user.phone} ${user.accountNumber}`.toLowerCase().includes(query.toLowerCase()) && (filter === 'All statuses' || user.status === filter))
  const { page, setPage, visible, pageSize } = usePaged(filtered)
  const columns = [
    { key: 'name', label: 'Customer', render: user => <span className="person-cell"><span className="avatar avatar-small">{user.name.split(' ').map(part => part[0]).slice(0, 2).join('')}</span><span><strong>{user.name}</strong><small className="cell-sub">{user.email}</small></span></span> },
    { key: 'accountNumber', label: 'Account' }, { key: 'phone', label: 'Phone' },
    { key: 'accountType', label: 'Type', render: user => <span className="type-cell">{user.accountType}</span> },
    { key: 'balance', label: 'Balance', render: user => <strong>{money(user.balance)}</strong> },
    { key: 'status', label: 'Status', render: user => <Badge>{user.status}</Badge> },
    { key: 'actions', label: '', render: user => <div className="row-actions"><button disabled={exitingIds.has(user.id)} onClick={() => setDetails(user)}>View</button><button disabled={exitingIds.has(user.id)} onClick={() => setModal(user)}>Edit</button><button disabled={exitingIds.has(user.id)} className="danger-text" onClick={() => { if (window.confirm(`Delete ${user.name} and their associated account and transactions? This cannot be undone.`)) removeWithExit(user.id, () => { deleteUser(user.id); notify('Customer and associated banking data deleted.') }) }}>Delete</button></div> }
  ]
  return <><PageHeading eyebrow="CUSTOMER DIRECTORY" title="User management" description="A single place to manage every customer relationship." action={<button className="button button-primary" onClick={() => setModal({ create: true })}><Plus size={17} />Add customer</button>} />
    <div className="stats-grid compact-stats"><StatCard label="Total customers" value={customers.length} icon={Users} /><StatCard label="Active accounts" value={customers.filter(user => user.status === 'Active').length} icon={ShieldCheck} tone="blue" /><StatCard label="Total customer balance" value={money(customers.reduce((sum, user) => sum + Number(user.balance), 0))} icon={Wallet} tone="purple" /></div>
    <section className="panel table-panel"><div className="panel-header table-toolbar"><div><h2>All customers</h2><p>{filtered.length} customer{filtered.length === 1 ? '' : 's'} in your bank</p></div><div className="table-controls"><SearchBox value={query} onChange={value => { setQuery(value); setPage(1) }} placeholder="Search customers..." /><PillSelect label="Account status" value={filter} options={['All statuses', 'Active', 'Blocked', 'Closed'].map(value => ({ value, label: value }))} onChange={value => { setFilter(value); setPage(1) }} /></div></div><DataTable columns={columns} rows={visible} exitingIds={exitingIds} empty="No customers match your search." /><Pagination page={page} setPage={setPage} total={filtered.length} pageSize={pageSize} /></section>
    {modal && (modal.create ? <UserModal createUser={createUser} updateUser={updateUser} onClose={() => setModal(null)} onSaved={(message, close) => { close(); notify(message) }} /> : <UserModal user={modal} createUser={createUser} updateUser={updateUser} onClose={() => setModal(null)} onSaved={(message, close) => { close(); notify(message) }} />)}
    {details && <UserDetails user={details} onClose={() => setDetails(null)} />}
  </>
}

export function AccountsPage() {
  const { accounts, users, createAccount, updateAccount, deleteAccount, notify } = useBank()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All statuses')
  const [editing, setEditing] = useState(null)
  const [details, setDetails] = useState(null)
  const { exitingIds, removeWithExit } = useExitAnimation()
  const filtered = accounts.filter(account => {
    const owner = users.find(user => user.id === account.userId)
    return `${account.accountNumber} ${owner?.name} ${account.type}`.toLowerCase().includes(query.toLowerCase()) && (filter === 'All statuses' || account.status === filter)
  })
  const { page, setPage, visible, pageSize } = usePaged(filtered)
  const columns = [
    { key: 'accountNumber', label: 'Account number', render: account => <strong className="txn-id">{account.accountNumber}</strong> },
    { key: 'holder', label: 'Account holder', render: account => users.find(user => user.id === account.userId)?.name || 'Unknown user' },
    { key: 'type', label: 'Account type', render: account => <span className="type-cell">{account.type}</span> },
    { key: 'balance', label: 'Balance', render: account => <strong>{money(account.balance)}</strong> },
    { key: 'status', label: 'Status', render: account => <Badge>{account.status}</Badge> },
    { key: 'actions', label: '', render: account => <div className="row-actions"><button disabled={exitingIds.has(account.id)} onClick={() => setDetails(account)}>View</button><button disabled={exitingIds.has(account.id)} onClick={() => setEditing(account)}>Edit</button><button disabled={exitingIds.has(account.id)} className="danger-text" onClick={() => { if (window.confirm(`Delete account ${account.accountNumber}? The customer profile will remain, but this account will be closed.`)) removeWithExit(account.id, () => { deleteAccount(account.id); notify('Account deleted and customer account marked closed.') }) }}>Delete</button></div> }
  ]
  return <><PageHeading eyebrow="ACCOUNT DIRECTORY" title="Accounts" description="Review account balances, types and access status." action={<button className="button button-primary" onClick={() => setEditing({ create: true })}><Plus size={17} />Create account</button>} />
    <div className="stats-grid compact-stats"><StatCard label="Total accounts" value={accounts.length} icon={CreditCard} /><StatCard label="Active" value={accounts.filter(account => account.status === 'Active').length} icon={ShieldCheck} tone="blue" /><StatCard label="Total balance" value={money(accounts.reduce((sum, account) => sum + Number(account.balance), 0))} icon={Wallet} tone="purple" /></div>
    <section className="panel table-panel"><div className="panel-header table-toolbar"><div><h2>All accounts</h2><p>{filtered.length} account{filtered.length === 1 ? '' : 's'} found</p></div><div className="table-controls"><SearchBox value={query} onChange={value => { setQuery(value); setPage(1) }} placeholder="Search accounts..." /><PillSelect label="Account status" value={filter} options={['All statuses', 'Active', 'Blocked', 'Closed'].map(value => ({ value, label: value }))} onChange={value => { setFilter(value); setPage(1) }} /></div></div><DataTable columns={columns} rows={visible} exitingIds={exitingIds} empty="No accounts match your search." /><Pagination page={page} setPage={setPage} total={filtered.length} pageSize={pageSize} /></section>
    {editing && <AccountFormModal account={editing.create ? null : editing} users={users} createAccount={createAccount} updateAccount={updateAccount} onClose={() => setEditing(null)} onSaved={(message, close) => { close(); notify(message) }} />}
    {details && <Modal title="Account details" subtitle="Account and balance information." onClose={() => setDetails(null)}>{requestClose => <><div className="detail-grid account-detail-grid"><div><span>Account number</span><strong>{details.accountNumber}</strong></div><div><span>Holder</span><strong>{users.find(user => user.id === details.userId)?.name}</strong></div><div><span>Account type</span><strong>{details.type}</strong></div><div><span>Current balance</span><strong>{money(details.balance)}</strong></div><div><span>Account status</span><Badge>{details.status}</Badge></div></div><div className="modal-actions"><button className="button button-secondary" onClick={requestClose}>Close</button></div></>}</Modal>}
  </>
}

export function AdminTransactionsPage() {
  const { transactions, deleteTransaction, notify } = useBank()
  const [query, setQuery] = useState('')
  const [type, setType] = useState('All types')
  const [selected, setSelected] = useState(null)
  const { exitingIds, removeWithExit } = useExitAnimation()
  const filtered = useMemo(() => transactions.filter(transaction => `${transaction.id} ${transaction.userName} ${transaction.accountNumber} ${transaction.description}`.toLowerCase().includes(query.toLowerCase()) && (type === 'All types' || transaction.type === type)).sort((a, b) => b.date.localeCompare(a.date)), [transactions, query, type])
  const { page, setPage, visible, pageSize } = usePaged(filtered)
  return <><PageHeading eyebrow="BANK-WIDE ACTIVITY" title="Transactions" description="Monitor and manage every movement across the bank." action={<button className="button button-secondary" onClick={() => window.print()}><Download size={16} />Export / print</button>} />
    <div className="stats-grid compact-stats"><StatCard label="Transactions" value={transactions.length} icon={Activity} /><StatCard label="Deposits" value={money(transactions.filter(item => item.type === 'Deposit').reduce((sum, item) => sum + item.amount, 0))} icon={ArrowDownLeft} tone="blue" /><StatCard label="Withdrawals" value={money(transactions.filter(item => item.type === 'Withdrawal').reduce((sum, item) => sum + item.amount, 0))} icon={ArrowUpRight} tone="orange" /></div>
    <section className="panel table-panel"><div className="panel-header table-toolbar"><div><h2>All transactions</h2><p>{filtered.length} records across all customer accounts</p></div><div className="table-controls"><SearchBox value={query} onChange={value => { setQuery(value); setPage(1) }} placeholder="Search transactions..." /><PillSelect label="Transaction type" value={type} options={['All types', 'Deposit', 'Withdrawal'].map(value => ({ value, label: value }))} onChange={value => { setType(value); setPage(1) }} /></div></div>
      <div className="table-scroll"><table><thead><tr><th>Transaction ID</th><th>Customer</th><th>Account</th><th>Type</th><th>Amount</th><th>Date</th><th>Description</th><th>Actions</th></tr></thead><tbody className="stagger-children">{visible.length ? visible.map(transaction => <tr key={transaction.id} className={exitingIds.has(transaction.id) ? 'row-exit' : ''}><td><span className="txn-id">{transaction.id}</span></td><td>{transaction.userName}</td><td>{transaction.accountNumber}</td><td><Badge variant={transaction.type.toLowerCase()}>{transaction.type}</Badge></td><td className={`amount-cell ${transaction.type === 'Deposit' ? 'amount-in' : ''}`}>{transaction.type === 'Deposit' ? '+' : '−'}{money(transaction.amount)}</td><td>{prettyDate(transaction.date)}</td><td className="description-cell">{transaction.description}</td><td><div className="row-actions"><button disabled={exitingIds.has(transaction.id)} onClick={() => setSelected(transaction)}>View</button><button disabled={exitingIds.has(transaction.id)} className="danger-text" onClick={() => { if (window.confirm(`Delete transaction ${transaction.id}? The transaction history will be permanently changed.`)) removeWithExit(transaction.id, () => { deleteTransaction(transaction.id); notify('Transaction deleted.') }) }}>Delete</button></div></td></tr>) : <tr><td colSpan="8"><div className="table-empty">No transactions match your search.</div></td></tr>}</tbody></table></div><Pagination page={page} setPage={setPage} total={filtered.length} pageSize={pageSize} /></section>
    {selected && <Modal title="Transaction details" subtitle={selected.id} onClose={() => setSelected(null)}>{requestClose => <><div className="detail-grid account-detail-grid"><div><span>Account holder</span><strong>{selected.userName}</strong></div><div><span>Account number</span><strong>{selected.accountNumber}</strong></div><div><span>Transaction type</span><Badge variant={selected.type.toLowerCase()}>{selected.type}</Badge></div><div><span>Amount</span><strong>{money(selected.amount)}</strong></div><div><span>Date</span><strong>{prettyDate(selected.date)}</strong></div><div><span>Balance afterwards</span><strong>{money(selected.balance)}</strong></div><div><span>Description</span><strong>{selected.description}</strong></div></div><div className="modal-actions"><button className="button button-secondary" onClick={requestClose}>Close</button></div></>}</Modal>}
  </>
}

export function ReportsPage() {
  const { users, transactions, accounts } = useBank()
  const customers = users.filter(user => user.role === 'user')
  const deposits = transactions.filter(item => item.type === 'Deposit')
  const withdrawals = transactions.filter(item => item.type === 'Withdrawal')
  const totalDeposits = deposits.reduce((sum, item) => sum + item.amount, 0)
  const totalWithdrawals = withdrawals.reduce((sum, item) => sum + item.amount, 0)
  const totalBalance = customers.reduce((sum, item) => sum + Number(item.balance), 0)
  const activeCustomers = customers.filter(user => user.status === 'Active').length
  const max = Math.max(totalDeposits, totalWithdrawals, totalBalance, 1)
  const types = ['Savings', 'Current', 'Premium'].map(type => ({ type, count: accounts.filter(account => account.type === type).length }))
  return <><PageHeading eyebrow="INSIGHTS & ANALYTICS" title="Reports" description="The numbers behind a healthier, happier bank." action={<button className="button button-secondary" onClick={() => window.print()}><Download size={16} />Export report</button>} />
    <div className="stats-grid compact-stats"><StatCard label="Total bank balance" value={<AnimatedNumber value={totalBalance} format={money} />} detail="Current customer balances" icon={Wallet} /><StatCard label="Deposit volume" value={<AnimatedNumber value={totalDeposits} format={money} />} detail={`${deposits.length} successful deposits`} icon={ArrowDownLeft} tone="blue" /><StatCard label="Withdrawal volume" value={<AnimatedNumber value={totalWithdrawals} format={money} />} detail={`${withdrawals.length} successful withdrawals`} icon={ArrowUpRight} tone="orange" /><StatCard label="Average account balance" value={<AnimatedNumber value={customers.length ? totalBalance / customers.length : 0} format={money} />} detail="Per customer" icon={TrendingUp} tone="purple" /></div>
    <div className="reports-grid"><section className="panel report-panel"><div className="panel-header"><div><h2>Bank activity</h2><p>Aggregate volumes across the bank</p></div><span className="report-date">ALL TIME</span></div><div className="report-bars stagger-children">{[{ name: 'Deposits', value: totalDeposits, color: 'bar-green' }, { name: 'Withdrawals', value: totalWithdrawals, color: 'bar-orange' }, { name: 'Current balance', value: totalBalance, color: 'bar-blue' }].map(item => <div className="report-bar-row" key={item.name}><div className="report-bar-label"><span>{item.name}</span><strong><AnimatedNumber value={item.value} format={money} /></strong></div><div className="bar-track"><div className={`bar-fill ${item.color}`} style={{ width: `${Math.max(item.value / max * 100, item.value ? 5 : 0)}%` }} /></div></div>)}</div><div className="report-footnote"><Activity size={14} /> Totals reflect all recorded successful transactions.</div></section>
      <section className="panel report-panel"><div className="panel-header"><div><h2>Account mix</h2><p>Customer account types</p></div><span className="report-date">{accounts.length} TOTAL</span></div><div className="account-mix"><div className="account-mix-chart"><AnimatedDonut items={types.map((item, index) => ({ label: item.type, value: item.count, color: ['#0F5A3C', '#4452E0', '#F5B942'][index] }))} /><div><strong>{accounts.length}</strong><span>ACCOUNTS</span></div></div><div className="account-mix-legend">{types.map((item, index) => <div className="mix-label" key={item.type}><span className={`mix-dot mix-${index}`}></span>{item.type}<strong><AnimatedNumber value={item.count} /></strong><small>{accounts.length ? Math.round(item.count / accounts.length * 100) : 0}%</small></div>)}</div></div><div className="report-active-summary"><ProgressRing value={customers.length ? activeCustomers / customers.length * 100 : 0} size={58} label="ACTIVE" /><div><strong>Account activity</strong><span>{activeCustomers} of {customers.length} customers have active accounts.</span></div></div><div className="report-footnote"><Users size={14} /> {customers.length} registered customers in total.</div></section>
    </div>
  </>
}

export function AdminProfilePage() {
  const { currentUser, updateUser, notify } = useBank()
  return <><PageHeading eyebrow="ADMINISTRATOR SETTINGS" title="Your profile" description="Manage your administrator details and security." /><div className="profile-grid"><section className="panel profile-card"><div className="profile-cover admin-cover"><div className="profile-avatar-large">BA</div></div><div className="profile-card-body"><h2>{currentUser.name}</h2><p>{currentUser.email}</p><div className="profile-role"><span></span> Bank administrator</div><div className="profile-summary"><div><span>ROLE</span><strong>Administrator</strong></div><div><span>ACCESS</span><strong>Full banking system</strong></div></div></div></section><section className="panel profile-edit"><div className="panel-header"><div><h2>Personal information</h2><p>Keep your administrator profile up to date.</p></div></div><ProfileForm user={currentUser} updateUser={updateUser} notify={notify} /></section></div></>
}
