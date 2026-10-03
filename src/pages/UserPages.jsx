import { useMemo, useState } from 'react'
import { ArrowDownLeft, ArrowRight, ArrowUpRight, CalendarDays, Check, Clock3, CreditCard, Download, Eye, EyeOff, LockKeyhole, Plus, ShieldCheck, Wallet } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { BankingForm, ProfileForm } from '../components/Forms'
import BalanceTrend from '../components/BalanceTrend'
import { AnimatedNumber, Badge, PageHeading, Pagination, SearchBox, StatCard, TransactionTable, money, prettyDate, usePaged } from '../components/UI'
import { ActivityCalendar, BentoCard, BentoGrid, HBarList, PillBarChart, PillSelect, QuickDeposit, RecentActivityList, TickMeter } from '../components/BentoWidgets'
import { useBank } from '../context/BankContext'
import { getMonthlyActivity, getWeeklyActivity } from '../utils/activity'

const todayLabel = new Intl.DateTimeFormat('en', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date())

function BalanceCard({ user }) {
  const [show, setShow] = useState(true)
  return <div className="balance-card"><div className="balance-card-pattern"></div><div className="balance-top"><span className="balance-chip"><Wallet size={16} /> AVAILABLE BALANCE</span><button className="balance-eye" onClick={() => setShow(!show)} aria-label={show ? 'Hide balance' : 'Show balance'}>{show ? <Eye size={16} /> : <EyeOff size={16} />}</button></div>
    <div className="balance-amount"><span key={show ? 'visible' : 'hidden'} className="balance-value-transition">{show ? <AnimatedNumber value={user.balance} format={money} /> : '••••••••'}</span></div><div className="balance-bottom"><div><span>ACCOUNT HOLDER</span><strong>{user.name}</strong></div><div><span>ACCOUNT NUMBER</span><strong>{user.accountNumber}</strong></div><div className="card-type"><span>ACCOUNT TYPE</span><strong>{user.accountType}</strong></div></div>
  </div>
}

function QuickActions() {
  return <div className="quick-actions"><Link to="/app/deposit"><span className="quick-icon quick-deposit"><ArrowDownLeft size={18} /></span><span><strong>Add money</strong><small>Deposit funds</small></span><ArrowRight className="quick-arrow" size={16} /></Link><Link to="/app/withdraw"><span className="quick-icon quick-withdraw"><ArrowUpRight size={18} /></span><span><strong>Withdraw</strong><small>Move your money</small></span><ArrowRight className="quick-arrow" size={16} /></Link><Link to="/app/transactions"><span className="quick-icon quick-history"><Clock3 size={18} /></span><span><strong>Activity</strong><small>View transactions</small></span><ArrowRight className="quick-arrow" size={16} /></Link></div>
}

export function UserDashboard() {
  const { currentUser, transactions, transact, notify } = useBank()
  const [period, setPeriod] = useState('weekly')
  const [showBalance, setShowBalance] = useState(true)
  const mine = transactions.filter(transaction => transaction.userId === currentUser.id)
  const deposits = mine.filter(transaction => transaction.type === 'Deposit').reduce((sum, item) => sum + item.amount, 0)
  const withdrawals = mine.filter(transaction => transaction.type === 'Withdrawal').reduce((sum, item) => sum + item.amount, 0)
  const recent = [...mine].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5)
  const activity = period === 'weekly' ? getWeeklyActivity(mine) : getMonthlyActivity(mine)
  const savingsHealth = deposits + withdrawals ? deposits / (deposits + withdrawals) * 100 : 0
  const greeting = new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'
  return <><div className="welcome-row bento-welcome"><div><div className="eyebrow">{todayLabel.toUpperCase()}</div><h1>Good {greeting}, {currentUser.name.split(' ')[0]} <span className="wave">✳</span></h1><p>A calm, clear view of your money today.</p></div><div className="welcome-secure"><ShieldCheck size={15} /> Your account is secure</div></div>
    <BentoGrid className="customer-bento">
      <BentoCard variant="hero" span={4} rows={2} className="customer-hero-card">
        <div className="hero-kicker"><Wallet size={15} /> AVAILABLE BALANCE <Badge>{currentUser.status}</Badge></div>
        <div className="hero-balance"><strong key={showBalance ? 'shown' : 'hidden'} className="balance-value-transition">{showBalance ? <AnimatedNumber value={currentUser.balance} format={money} /> : '••••••••'}</strong><div className="hero-balance-bottom"><span>Current account balance</span><button type="button" className="hero-balance-toggle" onClick={() => setShowBalance(value => !value)} aria-label={showBalance ? 'Hide balance' : 'Show balance'}>{showBalance ? <Eye size={15} /> : <EyeOff size={15} />}</button></div></div>
        <div className="hero-account-chip"><span>ACCOUNT NUMBER</span><strong>{currentUser.accountNumber}</strong><span className="hero-account-type">{currentUser.accountType} account</span></div>
        <p className="hero-copy">Grow your savings, one deposit at a time.</p>
        <div className="hero-actions"><Link className="button hero-button-light" to="/app/deposit"><ArrowDownLeft size={16} /> Deposit</Link><Link className="button hero-button-outline" to="/app/withdraw"><ArrowUpRight size={16} /> Withdraw</Link></div>
      </BentoCard>
      <BentoCard title="Savings health" subtitle="A simple demo indicator of money in vs. out." span={4} className="health-bento-card">
        <div className="savings-health-value"><strong><AnimatedNumber value={savingsHealth} format={value => `${Math.round(value)}%`} /></strong><span>deposit share</span></div>
        <TickMeter value={savingsHealth} label="Deposit share of all customer transactions" />
        <div className="health-note"><span><i className="legend-in" /> Deposits {money(deposits)}</span><span><i className="legend-out" /> Withdrawals {money(withdrawals)}</span></div>
      </BentoCard>
      <BentoCard title="Weekly activity" subtitle="Your account movement, at a glance." span={4} rows={2} className="weekly-bento-card" action={<PillSelect label="Activity period" value={period} options={[{ value: 'weekly', label: 'Weekly' }, { value: 'monthly', label: 'Monthly' }]} onChange={setPeriod} />}>
        <PillBarChart items={activity} label={`${period === 'weekly' ? 'Weekly' : 'Monthly'} deposits and withdrawals`} />
      </BentoCard>
      <BentoCard title="Activity calendar" subtitle="Days you made deposits or withdrawals." span={4} rows={2} className="calendar-bento-card">
        <ActivityCalendar transactions={mine} label="Your monthly banking activity" />
      </BentoCard>
      <BentoCard title="Quick deposit" subtitle="Add money to your account." span={4} className="quick-bento-card"><QuickDeposit transact={transact} notify={notify} /></BentoCard>
      <BentoCard title="Money in vs. out" subtitle="Your overall account comparison." span={4} className="comparison-bento-card">
        <HBarList items={[{ label: 'Deposits', value: deposits }, { label: 'Withdrawals', value: withdrawals }, { label: 'Current balance', value: Number(currentUser.balance) }]} format={money} />
      </BentoCard>
      <BentoCard title="Recent activity" subtitle="Your latest account movements." span={4} className="recent-bento-card" action={<Link to="/app/transactions" className="button button-secondary button-pill">View all <ArrowRight size={14} /></Link>}>
        <RecentActivityList transactions={recent} emptyLabel="Your story starts here. Activity will appear as you bank." />
      </BentoCard>
      <BalanceTrend user={currentUser} transactions={mine} className="bento-span-8" />
    </BentoGrid>
  </>
}

export function AccountPage() {
  const { currentUser, transactions } = useBank()
  const mine = transactions.filter(item => item.userId === currentUser.id)
  const deposits = mine.filter(item => item.type === 'Deposit').reduce((sum, item) => sum + item.amount, 0)
  const withdrawals = mine.filter(item => item.type === 'Withdrawal').reduce((sum, item) => sum + item.amount, 0)
  const last = mine[0]
  return <><PageHeading eyebrow="YOUR MONEY, AT A GLANCE" title="My account" description="A clear view of your account and activity." />
    <div className="account-feature-grid"><BalanceCard user={currentUser} /><div className="account-details-panel panel"><div className="panel-header"><div><h2>Account details</h2><p>Your banking information</p></div><span className="verified-label"><ShieldCheck size={14} /> Verified</span></div>
      <div className="details-list"><div><span>Account holder</span><strong>{currentUser.name}</strong></div><div><span>Account number</span><strong>{currentUser.accountNumber}</strong></div><div><span>Account type</span><strong>{currentUser.accountType}</strong></div><div><span>Account status</span><Badge>{currentUser.status}</Badge></div><div><span>Email address</span><strong>{currentUser.email}</strong></div><div><span>Phone number</span><strong>{currentUser.phone}</strong></div></div><Link to="/app/profile" className="subtle-link details-edit">Edit personal details <ArrowRight size={15} /></Link>
    </div></div>
    <div className="section-heading"><div><h2>Your balance summary</h2><p>A complete picture of your account activity.</p></div></div>
    <div className="stats-grid"><StatCard label="Current balance" value={money(currentUser.balance)} detail="Available to spend" icon={Wallet} /><StatCard label="Total deposited" value={money(deposits)} detail="Across all transactions" icon={ArrowDownLeft} tone="blue" /><StatCard label="Total withdrawn" value={money(withdrawals)} detail="Across all transactions" icon={ArrowUpRight} tone="orange" /><StatCard label="Last transaction" value={last ? money(last.amount) : '—'} detail={last ? `${last.type} · ${prettyDate(last.date)}` : 'No activity yet'} icon={CalendarDays} tone="purple" /></div>
  </>
}

export function MoneyPage({ type }) {
  const { currentUser, transact, notify, transactions } = useBank()
  const deposit = type === 'Deposit'
  const last = transactions.find(item => item.userId === currentUser.id)
  return <><PageHeading eyebrow={deposit ? 'ADD TO YOUR BALANCE' : 'ACCESS YOUR MONEY'} title={deposit ? 'Make a deposit' : 'Make a withdrawal'} description={deposit ? 'Add funds securely to your Evergreen account.' : 'Move money from your account, whenever you need it.'} />
    <div className="money-page-grid"><section className="panel money-form-panel"><div className="panel-header"><div className={`large-action-icon ${deposit ? 'quick-deposit' : 'quick-withdraw'}`}>{deposit ? <ArrowDownLeft size={21} /> : <ArrowUpRight size={21} />}</div><div><h2>{deposit ? 'Deposit funds' : 'Withdraw funds'}</h2><p>{deposit ? 'Your balance updates instantly.' : 'Available funds are checked automatically.'}</p></div></div><BankingForm type={type} user={currentUser} transact={transact} notify={notify} /></section>
      <aside className="money-aside"><div className="balance-mini panel"><span className="small-muted">AVAILABLE BALANCE</span><strong>{money(currentUser.balance)}</strong><div className="balance-mini-divider"></div><span className="small-muted">ACCOUNT NUMBER</span><span className="mini-account-number">{currentUser.accountNumber}</span><Link to="/app/account" className="subtle-link">Account details <ArrowRight size={14} /></Link></div>
        <div className="security-note"><span><LockKeyhole size={17} /></span><div><strong>Bank-grade security</strong><p>Your money and personal details are protected with industry-leading security.</p></div></div>
        {last && <div className="last-txn-note panel"><div className="small-muted">LAST TRANSACTION</div><div><span className={`txn-type ${last.type === 'Deposit' ? 'txn-in' : 'txn-out'}`}>{last.type}</span><strong>{money(last.amount)}</strong></div><span className="small-muted">{prettyDate(last.date)} · {last.description}</span></div>}</aside>
    </div>
  </>
}

export function TransactionsPage() {
  const { currentUser, transactions } = useBank()
  const [query, setQuery] = useState('')
  const [type, setType] = useState('All types')
  const [sort, setSort] = useState('Newest first')
  const mine = useMemo(() => transactions.filter(transaction => transaction.userId === currentUser.id)
    .filter(transaction => type === 'All types' || transaction.type === type)
    .filter(transaction => `${transaction.id} ${transaction.description} ${transaction.type}`.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => sort === 'Newest first' ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date)), [transactions, currentUser, type, query, sort])
  const { page, setPage, visible, pageSize } = usePaged(mine)
  return <><PageHeading eyebrow="YOUR MONEY, YOUR MOVES" title="Transactions" description="Every deposit and withdrawal, all in one place." action={<button className="button button-secondary" onClick={() => window.print()}><Download size={16} />Export / print</button>} />
    <div className="stats-grid compact-stats"><StatCard label="Total activity" value={transactions.filter(item => item.userId === currentUser.id).length} detail="All transactions" icon={CreditCard} /><StatCard label="Total deposited" value={money(transactions.filter(item => item.userId === currentUser.id && item.type === 'Deposit').reduce((sum, item) => sum + item.amount, 0))} icon={ArrowDownLeft} tone="blue" /><StatCard label="Total withdrawn" value={money(transactions.filter(item => item.userId === currentUser.id && item.type === 'Withdrawal').reduce((sum, item) => sum + item.amount, 0))} icon={ArrowUpRight} tone="orange" /></div>
    <section className="panel table-panel"><div className="panel-header table-toolbar"><div><h2>All transactions</h2><p>{mine.length} {mine.length === 1 ? 'transaction' : 'transactions'} found</p></div><div className="table-controls"><SearchBox value={query} onChange={value => { setQuery(value); setPage(1) }} placeholder="Search activity..." /><PillSelect label="Transaction type" value={type} options={[{ value: 'All types', label: 'All types' }, { value: 'Deposit', label: 'Deposit' }, { value: 'Withdrawal', label: 'Withdrawal' }]} onChange={value => { setType(value); setPage(1) }} /><PillSelect label="Date order" value={sort} options={[{ value: 'Newest first', label: 'Newest first' }, { value: 'Oldest first', label: 'Oldest first' }]} onChange={value => { setSort(value); setPage(1) }} /></div></div><TransactionTable transactions={visible} /><Pagination page={page} setPage={setPage} total={mine.length} pageSize={pageSize} /></section>
  </>
}

export function ProfilePage() {
  const { currentUser, updateUser, notify } = useBank()
  return <><PageHeading eyebrow="ACCOUNT SETTINGS" title="Your profile" description="Keep your personal details up to date." />
    <div className="profile-grid"><section className="panel profile-card"><div className="profile-cover"><div className="profile-avatar-large">{currentUser.name.split(' ').map(part => part[0]).slice(0, 2).join('')}</div></div><div className="profile-card-body"><h2>{currentUser.name}</h2><p>{currentUser.email}</p><div className="profile-role"><span></span> Verified account holder</div><div className="profile-summary"><div><span>ACCOUNT NUMBER</span><strong>{currentUser.accountNumber}</strong></div><div><span>ACCOUNT TYPE</span><strong>{currentUser.accountType}</strong></div><div><span>ACCOUNT STATUS</span><strong><Badge>{currentUser.status}</Badge></strong></div></div></div></section>
      <section className="panel profile-edit"><div className="panel-header"><div><h2>Personal information</h2><p>Changes take effect immediately across your account.</p></div></div><ProfileForm user={currentUser} updateUser={updateUser} notify={notify} /></section>
    </div>
  </>
}
