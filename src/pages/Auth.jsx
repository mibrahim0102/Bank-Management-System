import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { ArrowRight, Check, Eye, EyeOff, Landmark, ShieldCheck, Sparkles } from 'lucide-react'
import { useBank } from '../context/BankContext'
import useShake from '../utils/useShake'

function AuthFrame({ children, mode }) {
  return <main className={`auth-page auth-${mode}`}><aside className="auth-visual"><Link to="/login" className="auth-brand" aria-label="Evergreen Bank home"><span className="brand-mark"><Landmark size={21} /></span><span className="auth-brand-name">evergreen</span><span className="auth-brand-bank">BANK</span></Link>
    <div className="auth-story"><div className="auth-kicker"><Sparkles size={14} /> BANKING, MADE HUMAN</div><h1>A little more<br />peace of <em>mind.</em></h1><p>Your money should work as hard as you do. Meet a more thoughtful kind of banking.</p><div className="auth-quote"><div className="quote-avatars"><span>AK</span><span>SA</span><span>UR</span></div><span>Trusted by <strong>12,000+</strong> people growing their future.</span></div></div>
    <div className="auth-vault" aria-hidden="true"><div className="auth-pattern"><div className="orbit orbit-one"></div><div className="orbit orbit-two"></div><div className="orbit orbit-three"></div></div><div className="orbit-core"><Landmark size={43} strokeWidth={1.3} /></div></div>
    <div className="auth-foot"><ShieldCheck size={15} /> Your data is always protected and private.</div>
  </aside><section className="auth-panel"><div className="auth-form-wrap">{children}<div className="auth-legal">By continuing, you agree to our <a href="#terms">Terms of Service</a> and <a href="#privacy">Privacy Policy</a>.</div></div><div className="auth-mobile-brand"><span className="brand-mark"><Landmark size={19} /></span> evergreen</div></section></main>
}

export function LoginPage() {
  const { currentUser, login, notify } = useBank()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const { shaking, triggerShake } = useShake()
  if (currentUser) return <Navigate to={currentUser.role === 'admin' ? '/admin' : '/app'} replace />
  const submit = event => {
    event.preventDefault()
    const result = login(email, password)
    if (result.error) { setError(result.error); triggerShake(); return }
    notify(`Welcome back, ${result.user.name.split(' ')[0]}.`)
    navigate(result.user.role === 'admin' ? '/admin' : '/app', { replace: true })
  }
  return <AuthFrame mode="login"><div className="auth-eyebrow">WELCOME BACK</div><h2 className="auth-title">Good to see you.</h2><p className="auth-subtitle">Sign in to your Evergreen account to continue.</p>
    <form className={`auth-form auth-stagger ${shaking ? 'shake' : ''}`} onSubmit={submit}><label className="field-label">Email address<input type="email" autoComplete="email" required value={email} onChange={event => setEmail(event.target.value)} placeholder="you@example.com" /></label>
      <label className="field-label">Password<div className="password-wrap"><input type={show ? 'text' : 'password'} autoComplete="current-password" required value={password} onChange={event => setPassword(event.target.value)} placeholder="Enter your password" /><button type="button" onClick={() => setShow(!show)} aria-label="Toggle password visibility">{show ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></label>
      {error && <div className="inline-error">{error}</div>}<button className="button button-primary auth-submit" type="submit">Sign in <ArrowRight size={16} /></button>
    </form>
    <div className="auth-switch">New to Evergreen? <Link to="/register">Create an account <ArrowRight size={14} /></Link></div>
    <div className="demo-accounts"><div className="demo-title"><span>DEMO ACCESS</span><span>READY TO EXPLORE</span></div><button onClick={() => { setEmail('user@gmail.com'); setPassword('user123'); setError('') }}><span className="demo-role">USER</span><span>user@gmail.com</span><span>••••••••</span><span className="demo-fill">Fill in <ArrowRight size={13} /></span></button><button onClick={() => { setEmail('admin@gmail.com'); setPassword('admin123'); setError('') }}><span className="demo-role demo-admin">ADMIN</span><span>admin@gmail.com</span><span>••••••••</span><span className="demo-fill">Fill in <ArrowRight size={13} /></span></button></div>
  </AuthFrame>
}

export function RegisterPage() {
  const { currentUser, register, notify } = useBank()
  const navigate = useNavigate()
  const [fields, setFields] = useState({ name: '', email: '', phone: '', cnic: '', password: '', confirmPassword: '', accountType: 'Savings' })
  const [error, setError] = useState('')
  const { shaking, triggerShake } = useShake()
  if (currentUser) return <Navigate to={currentUser.role === 'admin' ? '/admin' : '/app'} replace />
  const change = event => setFields({ ...fields, [event.target.name]: event.target.value })
  const submit = event => {
    event.preventDefault()
    if (fields.name.trim().length < 2) { setError('Please enter your full name.'); triggerShake(); return }
    if (!/^[+()\d\s-]{7,20}$/.test(fields.phone)) { setError('Enter a valid phone number.'); triggerShake(); return }
    if (fields.password.length < 6) { setError('Password must be at least 6 characters.'); triggerShake(); return }
    if (fields.password !== fields.confirmPassword) { setError('Your passwords do not match.'); triggerShake(); return }
    const result = register({ ...fields, name: fields.name.trim(), email: fields.email.trim(), password: fields.password })
    if (result.error) { setError(result.error); triggerShake(); return }
    notify('Your account is ready. Welcome to Evergreen!')
    navigate('/app', { replace: true })
  }
  return <AuthFrame mode="register"><div className="auth-eyebrow">A FRESH START</div><h2 className="auth-title">Let’s get you set up.</h2><p className="auth-subtitle">Open your account in just a few minutes.</p>
    <form className={`auth-form auth-stagger register-form ${shaking ? 'shake' : ''}`} onSubmit={submit}><label className="field-label">Full name<input name="name" required value={fields.name} onChange={change} placeholder="e.g. Ali Khan" /></label>
      <div className="form-two-col"><label className="field-label">Email address<input name="email" type="email" required value={fields.email} onChange={change} placeholder="you@example.com" /></label><label className="field-label">Phone number<input name="phone" required value={fields.phone} onChange={change} placeholder="+92 300 1234567" /></label></div>
      <div className="form-two-col"><label className="field-label">CNIC / national ID<input name="cnic" value={fields.cnic} onChange={change} placeholder="35202-1234567-1" /></label><label className="field-label">Account type<select name="accountType" value={fields.accountType} onChange={change}><option>Savings</option><option>Current</option><option>Premium</option></select></label></div>
      <div className="form-two-col"><label className="field-label">Password<input name="password" type="password" minLength="6" required value={fields.password} onChange={change} placeholder="At least 6 characters" /></label><label className="field-label">Confirm password<input name="confirmPassword" type="password" required value={fields.confirmPassword} onChange={change} placeholder="Repeat your password" /></label></div>
      {error && <div className="inline-error">{error}</div>}<button className="button button-primary auth-submit" type="submit">Create my account <ArrowRight size={16} /></button>
    </form>
    <div className="auth-switch">Already have an account? <Link to="/login">Sign in <ArrowRight size={14} /></Link></div><div className="register-safe"><Check size={15} /> Your information stays private and secure.</div>
  </AuthFrame>
}
