import { NavLink, Outlet, Link } from 'react-router-dom'
import { CalendarDays, ExternalLink, LogOut, Package, Settings, Tag } from 'lucide-react'
import { Logo } from '../components/Logo'
import { useAuth } from '../context/AuthContext'

const LINKS = [
  { to: '/admin/produtos', label: 'Produtos', icon: Package },
  { to: '/admin/categorias', label: 'Categorias', icon: Tag },
  { to: '/admin/feiras', label: 'Feiras', icon: CalendarDays },
  { to: '/admin/configuracoes', label: 'Configurações', icon: Settings },
]

export function AdminLayout() {
  const { signOut, session } = useAuth()

  return (
    <div className="flex min-h-screen bg-cream-dark">
      <aside className="flex w-64 shrink-0 flex-col border-r border-cocoa-100 bg-white">
        <div className="flex items-center gap-2.5 border-b border-cocoa-100 px-5 py-5">
          <Logo className="h-9 w-9" />
          <div className="leading-tight">
            <p className="font-display text-sm font-semibold text-cocoa-800">
              Tamara Confeitaria
            </p>
            <p className="text-xs text-cocoa-400">Painel admin</p>
          </div>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3">
          {LINKS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-cocoa-800 text-cream'
                    : 'text-cocoa-600 hover:bg-cocoa-100'
                }`
              }
            >
              <Icon className="h-4.5 w-4.5" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-cocoa-100 p-3">
          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-cocoa-600 hover:bg-cocoa-100"
          >
            <ExternalLink className="h-4.5 w-4.5" />
            Ver site
          </Link>
          <button
            onClick={() => signOut()}
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm font-medium text-cocoa-600 hover:bg-cocoa-100"
          >
            <LogOut className="h-4.5 w-4.5" />
            Sair
          </button>
          {session?.user?.email && (
            <p className="truncate px-3.5 pt-1 text-xs text-cocoa-400">{session.user.email}</p>
          )}
        </div>
      </aside>
      <main className="flex-1 overflow-x-hidden">
        <div className="mx-auto max-w-6xl px-6 py-8 md:px-10">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
