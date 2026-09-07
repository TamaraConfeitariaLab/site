import { Truck } from 'lucide-react'
import { useProducts } from '../hooks/useSupabaseQuery'
import { ProductCard } from '../components/ProductCard'

export function ProntaEntrega() {
  const { data: products, loading } = useProducts({ readyToShip: true })

  return (
    <div className="container-page py-16 md:py-20">
      <div className="max-w-2xl">
        <span className="inline-flex items-center gap-2 rounded-full bg-terracotta-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-terracotta-600">
          <Truck className="h-3.5 w-3.5" /> Disponível agora
        </span>
        <h1 className="mt-4 font-display text-4xl font-semibold text-cocoa-800">
          Pronta entrega
        </h1>
        <p className="mt-4 text-cocoa-600">
          Esses itens já estão prontos, embalados e disponíveis para retirada ou entrega mais
          rápida. Aproveite antes que acabe!
        </p>
      </div>

      <div className="mt-10">
        {loading ? (
          <p className="text-cocoa-500">Carregando...</p>
        ) : products.length === 0 ? (
          <div className="card p-10 text-center text-cocoa-500">
            Nenhum item de pronta entrega no momento. Volte em breve ou confira o catálogo
            completo!
          </div>
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
