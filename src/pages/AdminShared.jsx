import { AccountForm } from '../components/Forms'
import { Modal } from '../components/UI'

export function AccountFormModal({ account, users, createAccount, updateAccount, onClose, onSaved }) {
  return <Modal title={account ? 'Edit account' : 'Create account'} subtitle={account ? 'Update account details and access.' : 'Open a new account for an existing customer.'} onClose={onClose}>
    {requestClose => <AccountForm account={account || {}} users={users} onCancel={requestClose} onSubmit={fields => {
      const result = account ? updateAccount(account.id, fields) : createAccount(fields.userId, fields)
      if (!result.error) onSaved(account ? 'Account details updated.' : 'New account created.', requestClose)
      return result
    }} />}
  </Modal>
}
