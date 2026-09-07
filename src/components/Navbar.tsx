import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Menu, ShoppingBag, X } from 'lucide-react'
import { Logo } from './Logo'
import { InstagramIcon } from './icons/InstagramIcon'
import { useCart } from '../context/CartContext'
import { useSettings } from '../context/SettingsContext'

const NAV_LINKS = [
  { to: '/', label: 'Início' },
  { to: '/sobre', label: 'Sobre' },
  { to: '/catalogo', label: 'Catálogo' },
  { to: '/pronta-entrega', label: 'Pronta entrega' },
  { to: '/monte-sua-caixa', label: 'Monte sua caixa' },
  { to: '/feiras', label: 'Feiras' },
  { to: '/encomendas', label: 'Encomendas' },
  { to: '/presentes', label: 'Presentes' },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { totalQty, open: openCart } = useCart()
  const { settings } = useSettings()

  return (
    <header className="sticky top-0 z-30 border-b border-cocoa-100 bg-cream/90 backdrop-blur-md">
      <div className="container-page flex h-20 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
          <Logo />
          <div className="leading-tight">
            <p className="font-display text-lg font-semibold text-cocoa-800 sm:text-xl">
              Tamara Confeitaria Lab
            </p>
            <p className="text-xs text-cocoa-500">Cookies e Brownies Artesanais</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-0.5 xl:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-full px-2.5 py-2 text-[13px] font-medium transition-colors ${
                  isActive
                    ? 'bg-cocoa-800 text-cream'
                    : 'text-cocoa-700 hover:bg-cocoa-100'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/encomendas" className="btn btn-primary hidden whitespace-nowrap 2xl:inline-flex">
            Fazer pedido
          </Link>
          <a
            href={settings.instagram_url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="hidden h-10 w-10 items-center justify-center rounded-full border border-cocoa-200 text-cocoa-700 transition-colors hover:bg-cocoa-100 sm:flex"
          >
            <InstagramIcon className="h-4.5 w-4.5" />
          </a>
          <button
            type="button"
            onClick={openCart}
            aria-label="Carrinho"
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-cocoa-200 text-cocoa-700 transition-colors hover:bg-cocoa-100"
          >
            <ShoppingBag className="h-4.5 w-4.5" />
            {totalQty > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-terracotta-500 px-1 text-[11px] font-bold text-white">
                {totalQty}
              </span>
            )}
          </button>
          <button
            type="button"
            aria-label="Abrir menu"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-cocoa-200 text-cocoa-700 xl:hidden"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-cocoa-100 bg-cream px-4 pb-4 xl:hidden">
          <nav className="flex flex-col gap-1 pt-2">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-3 text-sm font-medium ${
                    isActive ? 'bg-cocoa-800 text-cream' : 'text-cocoa-700 hover:bg-cocoa-100'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <Link
              to="/encomendas"
              onClick={() => setMobileOpen(false)}
              className="btn btn-primary mt-2 justify-center"
            >
              Fazer pedido
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
