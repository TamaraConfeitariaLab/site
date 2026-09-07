import { MessageCircle } from 'lucide-react'
import { useSettings } from '../context/SettingsContext'
import { whatsappLink } from '../lib/whatsapp'

export function WhatsAppFloatButton() {
  const { settings } = useSettings()
  const link = whatsappLink(
    settings.whatsapp_number,
    'Olá! Vim pelo site e gostaria de fazer um pedido 🍪',
  )

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3.5 font-semibold text-white shadow-xl shadow-black/20 transition-transform hover:scale-105 md:bottom-7 md:right-7"
    >
      <MessageCircle className="h-5 w-5" fill="white" strokeWidth={0} />
      <span className="hidden sm:inline">Pedir no WhatsApp</span>
    </a>
  )
}
