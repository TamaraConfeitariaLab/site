import { useEffect, useState, type FormEvent } from 'react'
import { supabase } from '../lib/supabase'
import { DEFAULT_SETTINGS, type SiteSettings } from '../types'

const FIELDS: { key: keyof typeof DEFAULT_SETTINGS; label: string; type: 'text' | 'textarea' }[] = [
  { key: 'whatsapp_number', label: 'Número do WhatsApp (com DDI e DDD, só números)', type: 'text' },
  { key: 'instagram_url', label: 'Link do Instagram', type: 'text' },
  { key: 'city', label: 'Cidade', type: 'text' },
  { key: 'hero_title', label: 'Título de destaque (página inicial)', type: 'textarea' },
  { key: 'hero_subtitle', label: 'Subtítulo (página inicial)', type: 'textarea' },
  { key: 'about_text', label: 'Texto "Sobre"', type: 'textarea' },
]

export function SettingsAdmin() {
  const [form, setForm] = useState<SiteSettings>(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    supabase
      .from('site_settings')
      .select('key, value')
      .then(({ data, error }) => {
        if (!error && data) {
          const merged = { ...DEFAULT_SETTINGS }
          for (const row of data) if (row.value != null) merged[row.key] = row.value
          setForm(merged)
        }
        setLoading(false)
      })
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSaved(false)

    const rows = Object.entries(form).map(([key, value]) => ({ key, value }))
    const { error } = await supabase.from('site_settings').upsert(rows, { onConflict: 'key' })

    setSaving(false)
    if (error) {
      setError(error.message)
      return
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  if (loading) return <p className="text-cocoa-500">Carregando...</p>

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-cocoa-800">Configurações</h1>
      <p className="mt-1 text-sm text-cocoa-500">
        Edite as informações gerais exibidas no site.
      </p>

      <form onSubmit={handleSubmit} className="card mt-6 flex max-w-2xl flex-col gap-5 p-6">
        {FIELDS.map((field) => (
          <div key={field.key}>
            <label className="mb-1.5 block text-sm font-medium text-cocoa-700">
              {field.label}
            </label>
            {field.type === 'textarea' ? (
              <textarea
                rows={3}
                value={form[field.key] ?? ''}
                onChange={(e) => setForm((prev) => ({ ...prev, [field.key]: e.target.value }))}
                className="w-full rounded-xl border border-cocoa-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-terracotta-400"
              />
            ) : (
              <input
                value={form[field.key] ?? ''}
                onChange={(e) => setForm((prev) => ({ ...prev, [field.key]: e.target.value }))}
                className="w-full rounded-xl border border-cocoa-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-terracotta-400"
              />
            )}
          </div>
        ))}

        {error && (
          <p className="rounded-lg bg-terracotta-50 px-3 py-2 text-sm text-terracotta-700">
            {error}
          </p>
        )}
        {saved && (
          <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
            Configurações salvas com sucesso!
          </p>
        )}

        <button type="submit" disabled={saving} className="btn btn-primary w-fit disabled:opacity-60">
          {saving ? 'Salvando...' : 'Salvar configurações'}
        </button>
      </form>
    </div>
  )
}
