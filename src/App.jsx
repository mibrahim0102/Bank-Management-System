import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import { LoginPage, RegisterPage } from './pages/Auth'
import { AccountPage, MoneyPage, ProfilePage, TransactionsPage, UserDashboard } from './pages/UserPages'
import { AccountsPage, AdminProfilePage, AdminTransactionsPage, AdminWelcome, ReportsPage, UsersPage } from './pages/AdminPages'
import { useBank } from './context/BankContext'

function ProtectedRoute({ role }) {
  const { currentUser } = useBank()
  if (!currentUser) return <Navigate to="/login" replace />
  if (role && currentUser.role !== role) return <Navigate to={currentUser.role === 'admin' ? '/admin' : '/app'} replace />
  return <Outlet />
}

export default function App() {
  return <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route element={<ProtectedRoute role="user" />}><Route path="/app" element={<AppLayout />}><Route index element={<UserDashboard />} /><Route path="account" element={<AccountPage />} /><Route path="deposit" element={<MoneyPage type="Deposit" />} /><Route path="withdraw" element={<MoneyPage type="Withdrawal" />} /><Route path="transactions" element={<TransactionsPage />} /><Route path="profile" element={<ProfilePage />} /></Route></Route>
    <Route element={<ProtectedRoute role="admin" />}><Route path="/admin" element={<AppLayout />}><Route index element={<AdminIndex />} /><Route path="users" element={<UsersPage />} /><Route path="accounts" element={<AccountsPage />} /><Route path="transactions" element={<AdminTransactionsPage />} /><Route path="reports" element={<ReportsPage />} /><Route path="profile" element={<AdminProfilePage />} /></Route></Route>
    <Route path="/" element={<RoleHome />} /><Route path="*" element={<RoleHome />} />
  </Routes>
}

function AdminIndex() {
  return <AdminWelcome />
}

function RoleHome() {
  const { currentUser } = useBank()
  return <Navigate to={currentUser ? currentUser.role === 'admin' ? '/admin' : '/app' : '/login'} replace />
}
