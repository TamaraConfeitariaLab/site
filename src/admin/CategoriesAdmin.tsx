import { useEffect, useState, type FormEvent } from 'react'
import { Pencil, Plus, Trash2, X } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { slugify } from '../lib/format'
import type { Category } from '../types'

export function CategoriesAdmin() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    const { data, error } = await supabase.from('categories').select('*').order('sort_order')
    if (!error && data) setCategories(data)
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setError(null)

    if (editingId) {
      const { error } = await supabase
        .from('categories')
        .update({ name, slug: slugify(name) })
        .eq('id', editingId)
      if (error) return setError(error.message)
    } else {
      const { error } = await supabase.from('categories').insert({
        name,
        slug: slugify(name),
        sort_order: categories.length,
      })
      if (error) return setError(error.message)
    }
    setName('')
    setEditingId(null)
    load()
  }

  async function remove(c: Category) {
    if (!confirm(`Excluir categoria "${c.name}"? Produtos vinculados ficarão sem categoria.`))
      return
    await supabase.from('categories').delete().eq('id', c.id)
    load()
  }

  function edit(c: Category) {
    setEditingId(c.id)
    setName(c.name)
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-cocoa-800">Categorias</h1>
      <p className="mt-1 text-sm text-cocoa-500">
        Organize seus produtos em categorias como Cookies, Brownies, Kits...
      </p>

      <form onSubmit={handleSubmit} className="card mt-6 flex items-end gap-3 p-4">
        <div className="flex-1">
          <label className="mb-1.5 block text-sm font-medium text-cocoa-700">
            {editingId ? 'Editar categoria' : 'Nova categoria'}
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Cookies"
            className="w-full rounded-xl border border-cocoa-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-terracotta-400"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          {editingId ? 'Salvar' : (
            <>
              <Plus className="h-4 w-4" /> Adicionar
            </>
          )}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null)
              setName('')
            }}
            className="btn btn-secondary"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </form>
      {error && <p className="mt-2 text-sm text-terracotta-600">{error}</p>}

      <div className="card mt-6 divide-y divide-cocoa-50">
        {loading ? (
          <p className="p-6 text-cocoa-500">Carregando...</p>
        ) : categories.length === 0 ? (
          <p className="p-6 text-cocoa-500">Nenhuma categoria cadastrada ainda.</p>
        ) : (
          categories.map((c) => (
            <div key={c.id} className="flex items-center justify-between px-5 py-3">
              <span className="font-medium text-cocoa-800">{c.name}</span>
              <div className="flex gap-1">
                <button
                  onClick={() => edit(c)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-cocoa-500 hover:bg-cocoa-100"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => remove(c)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-cocoa-500 hover:bg-terracotta-50 hover:text-terracotta-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
