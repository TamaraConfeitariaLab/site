import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function ProtectedRoute() {
  const { session, isAdmin, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <p className="text-cocoa-500">Carregando...</p>
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/admin/login" replace />
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-cream px-6 text-center">
        <p className="font-display text-xl font-semibold text-cocoa-800">Acesso restrito</p>
        <p className="max-w-sm text-sm text-cocoa-500">
          Sua conta está autenticada, mas não tem permissão de administrador neste site.
        </p>
      </div>
    )
  }

  return <Outlet />
}
