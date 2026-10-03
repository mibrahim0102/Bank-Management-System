import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Activity, ArrowDownLeft, ArrowLeftRight, ArrowUpRight, Bell, ChevronDown, CircleHelp, CreditCard, FileChartColumnIncreasing, Landmark, LayoutDashboard, LogOut, Menu, Printer, Search, Settings, ShieldCheck, Users, Wallet, X } from 'lucide-react'
import { useBank } from '../context/BankContext'
import { Toast } from '../components/UI'

function PageSkeleton() {
  return <div className="page-skeleton" aria-hidden="true">
    <div className="skeleton-heading"><span className="skeleton-block skeleton-eyebrow shimmer" /><span className="skeleton-block skeleton-title shimmer" /><span className="skeleton-block skeleton-description shimmer" /></div>
    <div className="skeleton-stats">{[1, 2, 3, 4].map(item => <div key={item} className="skeleton-card shimmer"><i /><span /><strong /></div>)}</div>
    <div className="skeleton-feature shimmer"><i /><span /><span /><b /></div>
    <div className="skeleton-table shimmer"><i />{[1, 2, 3, 4].map(item => <span key={item} />)}</div>
  </div>
}

function RouteContent({ pathname }) {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 480)
    return () => window.clearTimeout(timer)
  }, [pathname])
  return <div className="page-content" aria-busy={!ready}>
    {ready ? <div key={pathname} className="route-transition"><Outlet /></div> : <PageSkeleton />}
  </div>
}

const userLinks = [
  { to: '/app', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/app/account', label: 'My account', icon: CreditCard },
  { to: '/app/deposit', label: 'Deposit', icon: ArrowDownLeft },
  { to: '/app/withdraw', label: 'Withdraw', icon: ArrowUpRight },
  { to: '/app/transactions', label: 'Transactions', icon: ArrowLeftRight }
]
const adminLinks = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/users', label: 'User management', icon: Users },
  { to: '/admin/accounts', label: 'Accounts', icon: CreditCard },
  { to: '/admin/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { to: '/admin/reports', label: 'Reports', icon: FileChartColumnIncreasing }
]

export default function AppLayout() {
  const { currentUser, logout, notice, notify, dismissNotice } = useBank()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const isAdmin = currentUser?.role === 'admin'
  const links = isAdmin ? adminLinks : userLinks
  const base = isAdmin ? '/admin' : '/app'
  const signOut = () => { logout(); navigate('/login') }
  return <div className="app-shell">
    <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
      <div className="brand"><span className="brand-mark"><Landmark size={21} /></span><span>evergreen<span className="brand-bank">BANK</span></span>{mobileOpen && <button className="mobile-close" onClick={() => setMobileOpen(false)}><X size={19} /></button>}</div>
      <div className="workspace-label">{isAdmin ? 'ADMINISTRATION' : 'PERSONAL BANKING'}</div>
      <nav className="side-nav">{links.map(({ to, label, icon: Icon, end }) => <NavLink key={to} to={to} end={end} onClick={() => setMobileOpen(false)} className={({ isActive }) => `nav-item ${isActive ? 'nav-active' : ''}`}><Icon size={18} strokeWidth={1.8} /><span>{label}</span>{label === 'Transactions' && <span className="nav-count">{isAdmin ? '05' : '03'}</span>}</NavLink>)}</nav>
      {!isAdmin && <><div className="workspace-label nav-section-gap">PREFERENCES</div><NavLink to="/app/profile" onClick={() => setMobileOpen(false)} className={({ isActive }) => `nav-item ${isActive ? 'nav-active' : ''}`}><Settings size={18} strokeWidth={1.8} /><span>My profile</span></NavLink></>}
      {isAdmin && <><div className="workspace-label nav-section-gap">PREFERENCES</div><NavLink to="/admin/profile" onClick={() => setMobileOpen(false)} className={({ isActive }) => `nav-item ${isActive ? 'nav-active' : ''}`}><Settings size={18} strokeWidth={1.8} /><span>Admin profile</span></NavLink></>}
      <div className="sidebar-bottom"><div className="help-card"><div className="help-icon"><CircleHelp size={17} /></div><strong>Need a hand?</strong><span>Our support team is here for you.</span><button onClick={() => notify('Our support team will be in touch shortly.')}>Contact support <span>↗</span></button></div><button className="logout-link" onClick={signOut}><LogOut size={18} /><span>Sign out</span></button></div>
      <div className="sidebar-footnote"><ShieldCheck size={14} /> Secure, encrypted banking</div>
    </aside>
    {mobileOpen && <button className="mobile-scrim" aria-label="Close navigation" onClick={() => setMobileOpen(false)} />}
    <main className="main-area">
      <header className="topbar"><button className="mobile-menu" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><Menu size={21} /></button><div className="breadcrumbs"><span>Workspace</span><span className="crumb-slash">/</span><span>{isAdmin ? 'Administration' : 'Personal banking'}</span></div>
        <div className="topbar-right"><NavLink to={`${base}/transactions`} className="topbar-search" aria-label="Search transactions"><Search size={15} /><span>Search activity</span><kbd>/</kbd></NavLink><div className="secure-pill"><span></span> Secure session</div><button className="notification-button" onClick={() => notify('You’re all caught up.')} aria-label="Notifications"><Bell size={18} /><i></i></button><button className="notification-button topbar-print" onClick={() => window.print()} aria-label="Print current page"><Printer size={17} /></button><div className="topbar-divider"></div>
          <NavLink className="user-menu" to={`${base}/profile`}><span className="avatar">{currentUser?.name?.split(' ').map(part => part[0]).slice(0, 2).join('')}</span><span className="user-menu-text"><strong>{currentUser?.name}</strong><small>{isAdmin ? 'Administrator' : 'Personal account'}</small></span><ChevronDown size={14} className="user-chevron" /></NavLink>
        </div>
      </header>
      <RouteContent key={location.pathname} pathname={location.pathname} />
      <footer className="page-footer"><span>© 2026 Evergreen Bank. All rights reserved.</span><span><Activity size={13} /> All systems operational</span></footer>
    </main>
    <Toast notice={notice} onClose={dismissNotice} />
  </div>
}
