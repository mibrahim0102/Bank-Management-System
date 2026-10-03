export const starterUsers = [
  {
    id: 'admin-001', name: 'Bank Administrator', email: 'admin@gmail.com',
    phone: '+1 (415) 555-0100', cnic: '10000-0000000-0', password: 'admin123',
    role: 'admin', accountType: '—', accountNumber: '—', balance: 0, status: 'Active'
  },
  {
    id: 'user-001', name: 'Ali Khan', email: 'user@gmail.com',
    phone: '+92 300 1234567', cnic: '35202-1234567-1', password: 'user123',
    role: 'user', accountType: 'Premium', accountNumber: 'ACC10001', balance: 50000, status: 'Active'
  },
  {
    id: 'user-002', name: 'Sara Ahmed', email: 'sara@gmail.com',
    phone: '+92 321 7654321', cnic: '35202-7654321-2', password: 'sara123',
    role: 'user', accountType: 'Savings', accountNumber: 'ACC10002', balance: 78500, status: 'Active'
  },
  {
    id: 'user-003', name: 'Usman Raza', email: 'usman@gmail.com',
    phone: '+92 333 9876543', cnic: '35202-9876543-3', password: 'usman123',
    role: 'user', accountType: 'Current', accountNumber: 'ACC10003', balance: 26750, status: 'Blocked'
  }
]

export const starterTransactions = [
  { id: 'TXN-24001', userId: 'user-001', userName: 'Ali Khan', accountNumber: 'ACC10001', type: 'Deposit', amount: 25000, date: '2026-09-26', description: 'Salary credit', balance: 50000 },
  { id: 'TXN-24002', userId: 'user-001', userName: 'Ali Khan', accountNumber: 'ACC10001', type: 'Withdrawal', amount: 5000, date: '2026-09-25', description: 'ATM withdrawal', balance: 25000 },
  { id: 'TXN-24003', userId: 'user-001', userName: 'Ali Khan', accountNumber: 'ACC10001', type: 'Deposit', amount: 30000, date: '2026-09-22', description: 'Initial deposit', balance: 30000 },
  { id: 'TXN-24004', userId: 'user-002', userName: 'Sara Ahmed', accountNumber: 'ACC10002', type: 'Deposit', amount: 18500, date: '2026-09-27', description: 'Monthly savings', balance: 78500 },
  { id: 'TXN-24005', userId: 'user-003', userName: 'Usman Raza', accountNumber: 'ACC10003', type: 'Withdrawal', amount: 3250, date: '2026-09-28', description: 'Card purchase', balance: 26750 }
]
