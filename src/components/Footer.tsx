import { Link } from 'react-router-dom'
import { MapPin, MessageCircle } from 'lucide-react'
import { Logo } from './Logo'
import { InstagramIcon } from './icons/InstagramIcon'
import { useSettings } from '../context/SettingsContext'
import { whatsappLink } from '../lib/whatsapp'

export function Footer() {
  const { settings } = useSettings()

  return (
    <footer className="mt-24 border-t border-cocoa-100 bg-cocoa-800 text-cream/80">
      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <Logo />
            <span className="font-display text-lg font-semibold text-cream">
              Tamara Confeitaria Lab
            </span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-cream/70">
            Cookies e brownies artesanais feitos à mão em {settings.city}, com ingredientes
            selecionados e muito carinho em cada lote.
          </p>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-cream">
            Navegue
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link className="hover:text-terracotta-300" to="/catalogo">Catálogo</Link></li>
            <li><Link className="hover:text-terracotta-300" to="/pronta-entrega">Pronta entrega</Link></li>
            <li><Link className="hover:text-terracotta-300" to="/monte-sua-caixa">Monte sua caixa</Link></li>
            <li><Link className="hover:text-terracotta-300" to="/feiras">Feiras</Link></li>
            <li><Link className="hover:text-terracotta-300" to="/presentes">Presentes</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-cream">
            Empresa
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link className="hover:text-terracotta-300" to="/sobre">Sobre nós</Link></li>
            <li><Link className="hover:text-terracotta-300" to="/encomendas">Encomendas</Link></li>
            <li><Link className="hover:text-terracotta-300" to="/admin/login">Área administrativa</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-cream">
            Contato
          </h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <a
                className="flex items-center gap-2 hover:text-terracotta-300"
                href={whatsappLink(settings.whatsapp_number, 'Olá! Vim pelo site :)')}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-4 w-4 shrink-0" /> WhatsApp
              </a>
            </li>
            <li>
              <a
                className="flex items-center gap-2 hover:text-terracotta-300"
                href={settings.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <InstagramIcon className="h-4 w-4 shrink-0" /> Instagram
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0" /> {settings.city}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/10 py-5">
        <p className="container-page text-center text-xs text-cream/50">
          © {new Date().getFullYear()} Tamara Confeitaria Lab. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  )
}
