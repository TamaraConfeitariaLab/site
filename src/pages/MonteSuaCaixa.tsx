import { useMemo, useState } from 'react'
import { Gift, Minus, Plus } from 'lucide-react'
import { useProducts } from '../hooks/useSupabaseQuery'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../lib/format'

const BOX_PRICE_TIERS = [
  { qty: 4, label: 'Caixa pequena', hint: '4 unidades' },
  { qty: 6, label: 'Caixa média', hint: '6 unidades' },
  { qty: 9, label: 'Caixa grande', hint: '9 unidades' },
]

export function MonteSuaCaixa() {
  const { data: products, loading } = useProducts({ boxOption: true })
  const { addItem, open } = useCart()
  const [selected, setSelected] = useState<Record<string, number>>({})
  const [targetQty, setTargetQty] = useState(6)

  const totalSelected = useMemo(
    () => Object.values(selected).reduce((sum, n) => sum + n, 0),
    [selected],
  )

  const totalCents = useMemo(
    () =>
      products.reduce((sum, p) => sum + (selected[p.id] ?? 0) * p.price_cents, 0),
    [products, selected],
  )

  function change(productId: string, delta: number) {
    setSelected((prev) => {
      const next = Math.max(0, (prev[productId] ?? 0) + delta)
      return { ...prev, [productId]: next }
    })
  }

  function addBoxToCart() {
    for (const p of products) {
      const qty = selected[p.id] ?? 0
      if (qty > 0) addItem(p, qty)
    }
    setSelected({})
    open()
  }

  return (
    <div className="container-page py-16 md:py-20">
      <div className="max-w-2xl">
        <span className="inline-flex items-center gap-2 rounded-full bg-terracotta-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-terracotta-600">
          <Gift className="h-3.5 w-3.5" /> Personalize
        </span>
        <h1 className="mt-4 font-display text-4xl font-semibold text-cocoa-800">
          Monte sua caixa
        </h1>
        <p className="mt-4 text-cocoa-600">
          Escolha o tamanho da caixa e os sabores que você mais gosta. Nós cuidamos da
          embalagem para deixar tudo lindo para presentear (ou se presentear).
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        {BOX_PRICE_TIERS.map((tier) => (
          <button
            key={tier.qty}
            onClick={() => setTargetQty(tier.qty)}
            className={`rounded-2xl border px-5 py-3 text-left transition-colors ${
              targetQty === tier.qty
                ? 'border-terracotta-400 bg-terracotta-50'
                : 'border-cocoa-200 bg-white hover:bg-cream-dark'
            }`}
          >
            <p className="font-display font-semibold text-cocoa-800">{tier.label}</p>
            <p className="text-xs text-cocoa-500">{tier.hint}</p>
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div>
          {loading ? (
            <p className="text-cocoa-500">Carregando sabores...</p>
          ) : products.length === 0 ? (
            <div className="card p-10 text-center text-cocoa-500">
              Nenhum sabor disponível para montar caixa no momento.
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {products.map((p) => (
                <li
                  key={p.id}
                  className="card flex items-center gap-4 p-4"
                >
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-cocoa-100">
                    {p.image_url && (
                      <img src={p.image_url} alt={p.name} className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-display font-semibold text-cocoa-800">{p.name}</p>
                    <p className="text-sm text-cocoa-500">{formatPrice(p.price_cents)} / un.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => change(p.id, -1)}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-cocoa-200 hover:bg-cocoa-100"
                      aria-label="Diminuir"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-6 text-center font-medium">{selected[p.id] ?? 0}</span>
                    <button
                      onClick={() => change(p.id, 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-cocoa-200 hover:bg-cocoa-100"
                      aria-label="Aumentar"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card sticky top-24 h-fit p-6">
          <h2 className="font-display text-lg font-semibold text-cocoa-800">Resumo da caixa</h2>
          <div className="mt-4 flex items-center justify-between text-sm text-cocoa-600">
            <span>Sugestão de itens</span>
            <span className={totalSelected >= targetQty ? 'font-semibold text-terracotta-600' : ''}>
              {totalSelected} / {targetQty}
            </span>
          </div>
          <div className="mt-1 h-2 overflow-hidden rounded-full bg-cocoa-100">
            <div
              className="h-full bg-terracotta-400 transition-all"
              style={{ width: `${Math.min(100, (totalSelected / targetQty) * 100)}%` }}
            />
          </div>
          <div className="mt-5 flex items-center justify-between border-t border-cocoa-100 pt-4">
            <span className="text-sm text-cocoa-500">Total</span>
            <span className="font-display text-xl font-semibold text-cocoa-800">
              {formatPrice(totalCents)}
            </span>
          </div>
          <button
            disabled={totalSelected === 0}
            onClick={addBoxToCart}
            className="btn btn-primary mt-5 w-full disabled:cursor-not-allowed disabled:opacity-40"
          >
            Adicionar caixa ao pedido
          </button>
        </div>
      </div>
    </div>
  )
}
