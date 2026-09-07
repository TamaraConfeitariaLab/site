import { Gift } from 'lucide-react'
import { useProducts } from '../hooks/useSupabaseQuery'
import { ProductCard } from '../components/ProductCard'

export function Presentes() {
  const { data: products, loading } = useProducts({ giftable: true })

  return (
    <div className="container-page py-16 md:py-20">
      <div className="max-w-2xl">
        <span className="inline-flex items-center gap-2 rounded-full bg-terracotta-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-terracotta-600">
          <Gift className="h-3.5 w-3.5" /> Para presentear
        </span>
        <h1 className="mt-4 font-display text-4xl font-semibold text-cocoa-800">Presentes</h1>
        <p className="mt-4 text-cocoa-600">
          Caixas e kits especiais, embalados com carinho para presentear quem você ama — ou
          para se presentear também!
        </p>
      </div>

      <div className="mt-10">
        {loading ? (
          <p className="text-cocoa-500">Carregando...</p>
        ) : products.length === 0 ? (
          <div className="card p-10 text-center text-cocoa-500">
            Nenhum item de presente cadastrado ainda. Que tal montar sua própria caixa?
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
