import { useState } from 'react'
import { useCategories, useProducts } from '../hooks/useSupabaseQuery'
import { ProductCard } from '../components/ProductCard'

type ActiveFilter =
  | { kind: 'all' }
  | { kind: 'category'; slug: string }
  | { kind: 'ready' }
  | { kind: 'gift' }

export function Catalogo() {
  const { data: categories } = useCategories()
  const [filter, setFilter] = useState<ActiveFilter>({ kind: 'all' })

  const { data: products, loading } = useProducts(
    filter.kind === 'category'
      ? { categorySlug: filter.slug }
      : filter.kind === 'ready'
        ? { readyToShip: true }
        : filter.kind === 'gift'
          ? { giftable: true }
          : undefined,
  )

  function isActive(f: ActiveFilter) {
    if (f.kind !== filter.kind) return false
    if (f.kind === 'category' && filter.kind === 'category') return f.slug === filter.slug
    return true
  }

  function chipClass(active: boolean) {
    return `shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
      active ? 'bg-cocoa-800 text-cream' : 'border border-cocoa-200 text-cocoa-700 hover:bg-cocoa-100'
    }`
  }

  return (
    <div className="container-page py-16 md:py-20">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-terracotta-500">
          Catálogo
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-cocoa-800">
          Cookies, brownies e muito mais
        </h1>
        <p className="mt-4 text-cocoa-600">
          Explore todos os nossos sabores. Clique em um item para ver os detalhes e
          adicionar ao pedido, finalizando direto pelo WhatsApp.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-2 overflow-x-auto">
        <button onClick={() => setFilter({ kind: 'all' })} className={chipClass(isActive({ kind: 'all' }))}>
          Todos
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setFilter({ kind: 'category', slug: c.slug })}
            className={chipClass(isActive({ kind: 'category', slug: c.slug }))}
          >
            {c.name}
          </button>
        ))}
        <button onClick={() => setFilter({ kind: 'ready' })} className={chipClass(isActive({ kind: 'ready' }))}>
          Pronta entrega
        </button>
        <button onClick={() => setFilter({ kind: 'gift' })} className={chipClass(isActive({ kind: 'gift' }))}>
          Presentes
        </button>
      </div>

      <div className="mt-10">
        {loading ? (
          <p className="text-cocoa-500">Carregando produtos...</p>
        ) : products.length === 0 ? (
          <p className="text-cocoa-500">Nenhum produto encontrado nessa categoria ainda.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
