import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { formatDate } from '../lib/format'
import type { Fair } from '../types'

export function FairsAdmin() {
  const [fairs, setFairs] = useState<Fair[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    const { data, error } = await supabase
      .from('fairs')
      .select('*')
      .order('event_date', { ascending: true })
    if (!error && data) setFairs(data)
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  async function toggleActive(f: Fair) {
    setFairs((prev) => prev.map((x) => (x.id === f.id ? { ...x, is_active: !f.is_active } : x)))
    await supabase.from('fairs').update({ is_active: !f.is_active }).eq('id', f.id)
  }

  async function remove(f: Fair) {
    if (!confirm(`Excluir feira "${f.title}"?`)) return
    const { error } = await supabase.from('fairs').delete().eq('id', f.id)
    if (!error) setFairs((prev) => prev.filter((x) => x.id !== f.id))
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-cocoa-800">Feiras</h1>
          <p className="mt-1 text-sm text-cocoa-500">Gerencie os eventos e feiras da loja itinerante.</p>
        </div>
        <Link to="/admin/feiras/novo" className="btn btn-primary">
          <Plus className="h-4 w-4" /> Nova feira
        </Link>
      </div>

      <div className="card mt-6 divide-y divide-cocoa-50">
        {loading ? (
          <p className="p-6 text-cocoa-500">Carregando...</p>
        ) : fairs.length === 0 ? (
          <p className="p-6 text-cocoa-500">Nenhuma feira cadastrada ainda.</p>
        ) : (
          fairs.map((f) => (
            <div key={f.id} className="flex items-center justify-between gap-4 px-5 py-4">
              <div>
                <p className="font-medium text-cocoa-800">{f.title}</p>
                <p className="text-sm text-cocoa-500">
                  {formatDate(f.event_date)}
                  {f.location ? ` · ${f.location}` : ''}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleActive(f)}
                  className={`h-5 w-9 rounded-full transition-colors ${
                    f.is_active ? 'bg-terracotta-500' : 'bg-cocoa-200'
                  }`}
                  aria-label="Ativar/desativar"
                >
                  <span
                    className={`block h-4 w-4 translate-x-0.5 rounded-full bg-white transition-transform ${
                      f.is_active ? 'translate-x-[18px]' : ''
                    }`}
                  />
                </button>
                <Link
                  to={`/admin/feiras/${f.id}`}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-cocoa-500 hover:bg-cocoa-100"
                >
                  <Pencil className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => remove(f)}
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
