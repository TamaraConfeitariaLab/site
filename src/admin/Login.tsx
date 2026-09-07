import { useEffect, useState, type FormEvent } from 'react'
import { Navigate } from 'react-router-dom'
import { Lock, Mail } from 'lucide-react'
import { Logo } from '../components/Logo'
import { useAuth } from '../context/AuthContext'

const MAX_ATTEMPTS = 5
const LOCKOUT_SECONDS = 30

export function AdminLogin() {
  const { session, isAdmin, loading, signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [failedAttempts, setFailedAttempts] = useState(0)
  const [lockedUntil, setLockedUntil] = useState<number | null>(null)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (!lockedUntil) return
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [lockedUntil])

  if (!loading && session && isAdmin) {
    return <Navigate to="/admin/produtos" replace />
  }

  const secondsLeft = lockedUntil ? Math.max(0, Math.ceil((lockedUntil - now) / 1000)) : 0
  const isLocked = secondsLeft > 0

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (isLocked) return
    setSubmitting(true)
    setError(null)
    const { error } = await signIn(email, password)
    setSubmitting(false)
    if (error) {
      const attempts = failedAttempts + 1
      setFailedAttempts(attempts)
      if (attempts >= MAX_ATTEMPTS) {
        setLockedUntil(Date.now() + LOCKOUT_SECONDS * 1000)
        setFailedAttempts(0)
        setError(`Muitas tentativas. Aguarde ${LOCKOUT_SECONDS}s para tentar novamente.`)
      } else {
        setError(error)
      }
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <Logo className="h-14 w-14" />
          <div>
            <p className="font-display text-xl font-semibold text-cocoa-800">
              Tamara Confeitaria Lab
            </p>
            <p className="text-sm text-cocoa-500">Painel administrativo</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="card flex flex-col gap-4 p-6 shadow-lg">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-cocoa-700">E-mail</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-cocoa-400" />
              <input
                type="email"
                required
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-cocoa-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-terracotta-400"
                placeholder="seu@email.com"
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-cocoa-700">Senha</label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-cocoa-400" />
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-cocoa-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-terracotta-400"
                placeholder="••••••••"
              />
            </div>
          </div>
          {error && (
            <p className="rounded-lg bg-terracotta-50 px-3 py-2 text-sm text-terracotta-700">
              {isLocked
                ? `Muitas tentativas. Aguarde ${secondsLeft}s para tentar novamente.`
                : error}
            </p>
          )}
          <button
            type="submit"
            disabled={submitting || isLocked}
            className="btn btn-primary mt-2 justify-center disabled:opacity-60"
          >
            {isLocked ? `Aguarde ${secondsLeft}s` : submitting ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
