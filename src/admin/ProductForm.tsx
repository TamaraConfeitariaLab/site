import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { slugify } from '../lib/format'
import { ImageUploader } from './ImageUploader'
import type { Category, Product } from '../types'

const EMPTY: Omit<Product, 'id' | 'created_at' | 'updated_at'> = {
  slug: '',
  name: '',
  description: '',
  price_cents: 0,
  category_id: null,
  image_url: null,
  is_ready_to_ship: false,
  is_giftable: false,
  is_box_option: false,
  is_featured: false,
  is_active: true,
  stock_qty: null,
  sort_order: 0,
}

export function ProductForm() {
  const { id } = useParams()
  const isNew = !id || id === 'novo'
  const navigate = useNavigate()

  const [categories, setCategories] = useState<Category[]>([])
  const [form, setForm] = useState(EMPTY)
  const [priceInput, setPriceInput] = useState('0,00')
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    supabase
      .from('categories')
      .select('*')
      .order('sort_order')
      .then(({ data }) => setCategories(data ?? []))
  }, [])

  useEffect(() => {
    if (isNew) return
    supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (data && !error) {
          setForm(data)
          setPriceInput((data.price_cents / 100).toFixed(2).replace('.', ','))
        }
        setLoading(false)
      })
  }, [id, isNew])

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const payload = {
      ...form,
      slug: form.slug || slugify(form.name),
    }

    const { error } = isNew
      ? await supabase.from('products').insert(payload)
      : await supabase.from('products').update(payload).eq('id', id)

    setSaving(false)
    if (error) {
      setError(error.message)
      return
    }
    navigate('/admin/produtos')
  }

  if (loading) return <p className="text-cocoa-500">Carregando...</p>

  return (
    <div>
      <Link
        to="/admin/produtos"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-cocoa-500 hover:text-cocoa-800"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar para produtos
      </Link>
      <h1 className="font-display text-2xl font-semibold text-cocoa-800">
        {isNew ? 'Novo produto' : 'Editar produto'}
      </h1>

      <form onSubmit={handleSubmit} className="card mt-6 flex flex-col gap-5 p-6">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-cocoa-700">Imagem</label>
          <ImageUploader
            value={form.image_url}
            onChange={(url) => update('image_url', url)}
            folder="products"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-cocoa-700">Nome *</label>
            <input
              required
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              className="w-full rounded-xl border border-cocoa-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-terracotta-400"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-cocoa-700">
              Preço (R$) *
            </label>
            <input
              required
              inputMode="decimal"
              value={priceInput}
              onChange={(e) => {
                const raw = e.target.value
                setPriceInput(raw)
                const normalized = raw.replace(/\./g, '').replace(',', '.')
                const cents = Math.round(parseFloat(normalized) * 100)
                update('price_cents', Number.isFinite(cents) ? cents : 0)
              }}
              placeholder="0,00"
              className="w-full rounded-xl border border-cocoa-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-terracotta-400"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-cocoa-700">Descrição</label>
          <textarea
            rows={3}
            value={form.description ?? ''}
            onChange={(e) => update('description', e.target.value)}
            className="w-full rounded-xl border border-cocoa-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-terracotta-400"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-cocoa-700">Categoria</label>
            <select
              value={form.category_id ?? ''}
              onChange={(e) => update('category_id', e.target.value || null)}
              className="w-full rounded-xl border border-cocoa-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-terracotta-400"
            >
              <option value="">Sem categoria</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-cocoa-700">
              Estoque (opcional)
            </label>
            <input
              type="number"
              min={0}
              value={form.stock_qty ?? ''}
              onChange={(e) =>
                update('stock_qty', e.target.value === '' ? null : Number(e.target.value))
              }
              placeholder="Deixe em branco para ilimitado"
              className="w-full rounded-xl border border-cocoa-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-terracotta-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Checkbox
            label="Ativo no site"
            checked={form.is_active}
            onChange={(v) => update('is_active', v)}
          />
          <Checkbox
            label="Pronta entrega"
            checked={form.is_ready_to_ship}
            onChange={(v) => update('is_ready_to_ship', v)}
          />
          <Checkbox
            label="Presente"
            checked={form.is_giftable}
            onChange={(v) => update('is_giftable', v)}
          />
          <Checkbox
            label="Monte sua caixa"
            checked={form.is_box_option}
            onChange={(v) => update('is_box_option', v)}
          />
          <Checkbox
            label="Destaque na home"
            checked={form.is_featured}
            onChange={(v) => update('is_featured', v)}
          />
        </div>

        {error && (
          <p className="rounded-lg bg-terracotta-50 px-3 py-2 text-sm text-terracotta-700">
            {error}
          </p>
        )}

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving} className="btn btn-primary disabled:opacity-60">
            {saving ? 'Salvando...' : 'Salvar produto'}
          </button>
          <Link to="/admin/produtos" className="btn btn-secondary">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  )
}

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-cocoa-200 px-3 py-2.5 text-sm text-cocoa-700">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-terracotta-500"
      />
      {label}
    </label>
  )
}
