import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../lib/format'
import type { Product } from '../types'
import { ProductDetailModal } from './ProductDetailModal'

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()
  const [showDetail, setShowDetail] = useState(false)
  const outOfStock = product.stock_qty !== null && product.stock_qty <= 0

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={() => setShowDetail(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') setShowDetail(true)
        }}
        className="card group flex cursor-pointer flex-col overflow-hidden text-left transition-shadow hover:shadow-lg hover:shadow-cocoa-900/5"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-cocoa-100">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-cocoa-300">
              <span className="font-display text-2xl">TCL</span>
            </div>
          )}
          {product.is_ready_to_ship && (
            <span className="absolute left-3 top-3 rounded-full bg-cream px-3 py-1 text-xs font-semibold text-cocoa-700 shadow">
              Pronta entrega
            </span>
          )}
          {outOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-cocoa-900/50">
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-cocoa-800">
                Esgotado
              </span>
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-1 p-4">
          <h3 className="font-display text-base font-semibold text-cocoa-800">{product.name}</h3>
          {product.description && (
            <p className="line-clamp-2 text-sm text-cocoa-500">
              {product.description}{' '}
              <span className="font-medium text-terracotta-600">ver mais</span>
            </p>
          )}
          <div className="mt-auto flex items-center justify-between pt-3">
            <span className="font-display text-lg font-semibold text-terracotta-600">
              {formatPrice(product.price_cents)}
            </span>
            <button
              type="button"
              disabled={outOfStock}
              onClick={(e) => {
                e.stopPropagation()
                addItem(product)
              }}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-cocoa-800 text-cream transition-colors hover:bg-terracotta-500 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label={`Adicionar ${product.name}`}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {showDetail && (
        <ProductDetailModal product={product} onClose={() => setShowDetail(false)} />
      )}
    </>
  )
}
