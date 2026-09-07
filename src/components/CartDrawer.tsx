import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useSettings } from '../context/SettingsContext'
import { formatPrice } from '../lib/format'
import { whatsappLink } from '../lib/whatsapp'

export function CartDrawer() {
  const { items, isOpen, close, setQty, removeItem, totalCents, clear } = useCart()
  const { settings } = useSettings()

  if (!isOpen) return null

  function buildMessage() {
    const lines = items.map(
      (i) => `• ${i.qty}x ${i.name} — ${formatPrice(i.price_cents * i.qty)}`,
    )
    return [
      'Olá! Gostaria de fazer o seguinte pedido:',
      '',
      ...lines,
      '',
      `Total: ${formatPrice(totalCents)}`,
    ].join('\n')
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        aria-label="Fechar carrinho"
        className="absolute inset-0 bg-cocoa-900/40 backdrop-blur-sm"
        onClick={close}
      />
      <div className="fade-in relative flex h-full w-full max-w-md flex-col bg-cream shadow-2xl">
        <div className="flex items-center justify-between border-b border-cocoa-100 px-6 py-5">
          <h2 className="font-display text-xl font-semibold text-cocoa-800">Seu pedido</h2>
          <button
            onClick={close}
            aria-label="Fechar"
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-cocoa-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-cocoa-500">
              <ShoppingBag className="h-10 w-10 text-cocoa-300" />
              <p>Seu carrinho está vazio.</p>
              <p className="text-sm">Adicione cookies e brownies do catálogo!</p>
            </div>
          ) : (
            <ul className="flex flex-col gap-4">
              {items.map((item) => (
                <li key={item.id} className="flex gap-3 border-b border-cocoa-100 pb-4">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-cocoa-100">
                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-cocoa-800">{item.name}</p>
                      <button
                        onClick={() => removeItem(item.id)}
                        aria-label="Remover"
                        className="text-cocoa-400 hover:text-terracotta-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-sm text-cocoa-500">{formatPrice(item.price_cents)}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() => setQty(item.id, item.qty - 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-cocoa-200 hover:bg-cocoa-100"
                        aria-label="Diminuir"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-6 text-center text-sm font-medium">{item.qty}</span>
                      <button
                        onClick={() => setQty(item.id, item.qty + 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-cocoa-200 hover:bg-cocoa-100"
                        aria-label="Aumentar"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-cocoa-100 px-6 py-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-cocoa-500">Total</span>
              <span className="font-display text-xl font-semibold text-cocoa-800">
                {formatPrice(totalCents)}
              </span>
            </div>
            <a
              href={whatsappLink(settings.whatsapp_number, buildMessage())}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary w-full"
              onClick={() => setTimeout(clear, 400)}
            >
              Finalizar pedido no WhatsApp
            </a>
            <p className="mt-3 text-center text-xs text-cocoa-400">
              O pagamento e a combinação de entrega são feitos diretamente com a Tamara.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
