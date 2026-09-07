import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { ImageUploader } from './ImageUploader'
import type { Fair } from '../types'

const EMPTY: Omit<Fair, 'id' | 'created_at'> = {
  title: '',
  event_date: null,
  start_time: '',
  end_time: '',
  location: '',
  address: '',
  maps_url: '',
  image_url: null,
  is_active: true,
  sort_order: 0,
}

export function FairForm() {
  const { id } = useParams()
  const isNew = !id || id === 'novo'
  const navigate = useNavigate()

  const [form, setForm] = useState(EMPTY)
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isNew) return
    supabase
      .from('fairs')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (data && !error) setForm(data)
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

    const { error } = isNew
      ? await supabase.from('fairs').insert(form)
      : await supabase.from('fairs').update(form).eq('id', id)

    setSaving(false)
    if (error) {
      setError(error.message)
      return
    }
    navigate('/admin/feiras')
  }

  if (loading) return <p className="text-cocoa-500">Carregando...</p>

  return (
    <div>
      <Link
        to="/admin/feiras"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-cocoa-500 hover:text-cocoa-800"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar para feiras
      </Link>
      <h1 className="font-display text-2xl font-semibold text-cocoa-800">
        {isNew ? 'Nova feira' : 'Editar feira'}
      </h1>

      <form onSubmit={handleSubmit} className="card mt-6 flex flex-col gap-5 p-6">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-cocoa-700">Imagem</label>
          <ImageUploader value={form.image_url} onChange={(url) => update('image_url', url)} folder="fairs" />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-cocoa-700">Título *</label>
          <input
            required
            value={form.title}
            onChange={(e) => update('title', e.target.value)}
            className="w-full rounded-xl border border-cocoa-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-terracotta-400"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-cocoa-700">Data</label>
            <input
              type="date"
              value={form.event_date ?? ''}
              onChange={(e) => update('event_date', e.target.value || null)}
              className="w-full rounded-xl border border-cocoa-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-terracotta-400"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-cocoa-700">Início</label>
            <input
              type="time"
              value={form.start_time ?? ''}
              onChange={(e) => update('start_time', e.target.value)}
              className="w-full rounded-xl border border-cocoa-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-terracotta-400"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-cocoa-700">Término</label>
            <input
              type="time"
              value={form.end_time ?? ''}
              onChange={(e) => update('end_time', e.target.value)}
              className="w-full rounded-xl border border-cocoa-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-terracotta-400"
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-cocoa-700">Local</label>
            <input
              value={form.location ?? ''}
              onChange={(e) => update('location', e.target.value)}
              placeholder="Ex: Feira do Largo"
              className="w-full rounded-xl border border-cocoa-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-terracotta-400"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-cocoa-700">Endereço</label>
            <input
              value={form.address ?? ''}
              onChange={(e) => update('address', e.target.value)}
              className="w-full rounded-xl border border-cocoa-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-terracotta-400"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-cocoa-700">
            Link do Google Maps
          </label>
          <input
            value={form.maps_url ?? ''}
            onChange={(e) => update('maps_url', e.target.value)}
            placeholder="https://maps.google.com/..."
            className="w-full rounded-xl border border-cocoa-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-terracotta-400"
          />
        </div>

        <label className="flex w-fit cursor-pointer items-center gap-2 rounded-xl border border-cocoa-200 px-3 py-2.5 text-sm text-cocoa-700">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(e) => update('is_active', e.target.checked)}
            className="h-4 w-4 accent-terracotta-500"
          />
          Visível no site
        </label>

        {error && (
          <p className="rounded-lg bg-terracotta-50 px-3 py-2 text-sm text-terracotta-700">
            {error}
          </p>
        )}

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving} className="btn btn-primary disabled:opacity-60">
            {saving ? 'Salvando...' : 'Salvar feira'}
          </button>
          <Link to="/admin/feiras" className="btn btn-secondary">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  )
}
