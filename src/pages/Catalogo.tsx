import { useState } from 'react'
import { useCategories, useProducts } from '../hooks/useSupabaseQuery'
import { ProductCard } from '../components/ProductCard'

export function Catalogo() {
  const { data: categories } = useCategories()
  const [activeSlug, setActiveSlug] = useState<string | undefined>(undefined)
  const { data: products, loading } = useProducts({ categorySlug: activeSlug })

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
          Explore todos os nossos sabores. Clique em um item para adicionar ao pedido e
          finalizar direto pelo WhatsApp.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveSlug(undefined)}
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            activeSlug === undefined
              ? 'bg-cocoa-800 text-cream'
              : 'border border-cocoa-200 text-cocoa-700 hover:bg-cocoa-100'
          }`}
        >
          Todos
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveSlug(c.slug)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              activeSlug === c.slug
                ? 'bg-cocoa-800 text-cream'
                : 'border border-cocoa-200 text-cocoa-700 hover:bg-cocoa-100'
            }`}
          >
            {c.name}
          </button>
        ))}
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
