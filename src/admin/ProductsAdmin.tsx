import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { formatPrice } from '../lib/format'
import type { Product } from '../types'

export function ProductsAdmin() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('sort_order', { ascending: true })
    if (!error && data) setProducts(data)
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  async function toggleActive(p: Product) {
    setProducts((prev) => prev.map((x) => (x.id === p.id ? { ...x, is_active: !p.is_active } : x)))
    await supabase.from('products').update({ is_active: !p.is_active }).eq('id', p.id)
  }

  async function remove(p: Product) {
    if (!confirm(`Excluir "${p.name}"? Essa ação não pode ser desfeita.`)) return
    const { error } = await supabase.from('products').delete().eq('id', p.id)
    if (!error) setProducts((prev) => prev.filter((x) => x.id !== p.id))
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-cocoa-800">Produtos</h1>
          <p className="mt-1 text-sm text-cocoa-500">
            Gerencie cookies, brownies e itens do catálogo.
          </p>
        </div>
        <Link to="/admin/produtos/novo" className="btn btn-primary">
          <Plus className="h-4 w-4" /> Novo produto
        </Link>
      </div>

      <div className="card mt-6 overflow-x-auto">
        {loading ? (
          <p className="p-6 text-cocoa-500">Carregando...</p>
        ) : products.length === 0 ? (
          <p className="p-6 text-cocoa-500">Nenhum produto cadastrado ainda.</p>
        ) : (
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-cocoa-100 text-left text-xs uppercase tracking-wide text-cocoa-400">
                <th className="px-5 py-3 font-medium">Produto</th>
                <th className="px-5 py-3 font-medium">Preço</th>
                <th className="px-5 py-3 font-medium">Tags</th>
                <th className="px-5 py-3 font-medium">Ativo</th>
                <th className="px-5 py-3 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-cocoa-50 last:border-0">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-cocoa-100">
                        {p.image_url && (
                          <img src={p.image_url} alt="" className="h-full w-full object-cover" />
                        )}
                      </div>
                      <span className="font-medium text-cocoa-800">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-cocoa-600">{formatPrice(p.price_cents)}</td>
                  <td className="px-5 py-3">
                    <div className="flex flex-wrap gap-1">
                      {p.is_ready_to_ship && <Tag>Pronta entrega</Tag>}
                      {p.is_giftable && <Tag>Presente</Tag>}
                      {p.is_box_option && <Tag>Monte caixa</Tag>}
                      {p.is_featured && <Tag>Destaque</Tag>}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => toggleActive(p)}
                      className={`h-5 w-9 rounded-full transition-colors ${
                        p.is_active ? 'bg-terracotta-500' : 'bg-cocoa-200'
                      }`}
                      aria-label="Ativar/desativar"
                    >
                      <span
                        className={`block h-4 w-4 translate-x-0.5 rounded-full bg-white transition-transform ${
                          p.is_active ? 'translate-x-[18px]' : ''
                        }`}
                      />
                    </button>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-1">
                      <Link
                        to={`/admin/produtos/${p.id}`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-cocoa-500 hover:bg-cocoa-100"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => remove(p)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-cocoa-500 hover:bg-terracotta-50 hover:text-terracotta-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-cocoa-100 px-2 py-0.5 text-[11px] font-medium text-cocoa-600">
      {children}
    </span>
  )
}
