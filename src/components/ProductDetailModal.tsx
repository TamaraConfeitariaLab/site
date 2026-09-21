import { useState } from 'react'
import { Minus, Plus, Sparkles, X } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../lib/format'
import type { Product } from '../types'

export function ProductDetailModal({
  product,
  onClose,
}: {
  product: Product
  onClose: () => void
}) {
  const { addItem, open } = useCart()
  const [qty, setQty] = useState(1)
  const outOfStock = product.stock_qty !== null && product.stock_qty <= 0

  function handleAdd() {
    addItem(product, qty)
    onClose()
    open()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        aria-label="Fechar"
        className="absolute inset-0 bg-cocoa-900/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fade-in relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-[1.75rem] bg-cream shadow-2xl sm:flex-row">
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-cocoa-700 shadow hover:bg-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="h-56 shrink-0 bg-cocoa-100 sm:h-auto sm:w-2/5">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-cocoa-300">
              <span className="font-display text-2xl">TCL</span>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto p-6 sm:p-7">
          {product.is_ready_to_ship && (
            <span className="mb-2 w-fit rounded-full bg-terracotta-50 px-3 py-1 text-xs font-semibold text-terracotta-600">
              Pronta entrega
            </span>
          )}
          <h2 className="font-display text-2xl font-semibold text-cocoa-800">{product.name}</h2>
          <p className="mt-1 font-display text-xl font-semibold text-terracotta-600">
            {formatPrice(product.price_cents)}
          </p>

          {product.description && (
            <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-cocoa-600">
              {product.description}
            </p>
          )}

          {product.consumption_suggestion && (
            <div className="mt-5 rounded-2xl border border-cocoa-100 bg-white p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-cocoa-800">
                <Sparkles className="h-4 w-4 text-terracotta-500" />
                Combina perfeitamente com...
              </div>
              <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-cocoa-600">
                {product.consumption_suggestion}
              </p>
            </div>
          )}

          <div className="mt-auto flex items-center gap-4 pt-6">
            {outOfStock ? (
              <span className="rounded-full bg-cocoa-100 px-4 py-2 text-sm font-semibold text-cocoa-500">
                Esgotado
              </span>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-cocoa-200 hover:bg-cocoa-100"
                    aria-label="Diminuir"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-6 text-center font-medium">{qty}</span>
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-cocoa-200 hover:bg-cocoa-100"
                    aria-label="Aumentar"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <button onClick={handleAdd} className="btn btn-primary flex-1 justify-center">
                  Adicionar ao pedido
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
