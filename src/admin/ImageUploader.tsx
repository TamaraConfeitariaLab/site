import { useRef, useState } from 'react'
import { ImagePlus, Loader2, X } from 'lucide-react'
import { supabase } from '../lib/supabase'

type Props = {
  value: string | null
  onChange: (url: string | null) => void
  folder: string
}

export function ImageUploader({ value, onChange, folder }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFile(file: File) {
    if (!file.type.startsWith('image/')) {
      setError('Envie um arquivo de imagem.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('A imagem deve ter no máximo 5MB.')
      return
    }
    setError(null)
    setUploading(true)
    const ext = file.name.split('.').pop() || 'jpg'
    const path = `${folder}/${crypto.randomUUID()}.${ext}`
    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(path, file, { cacheControl: '3600', upsert: false })

    if (uploadError) {
      setError('Falha no upload: ' + uploadError.message)
      setUploading(false)
      return
    }

    const { data } = supabase.storage.from('product-images').getPublicUrl(path)
    onChange(data.publicUrl)
    setUploading(false)
  }

  return (
    <div>
      <div className="flex items-center gap-4">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dashed border-cocoa-200 bg-cocoa-50">
          {value ? (
            <img src={value} alt="Preview" className="h-full w-full object-cover" />
          ) : (
            <ImagePlus className="h-6 w-6 text-cocoa-300" />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="btn btn-secondary text-sm disabled:opacity-60"
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Enviando...
              </>
            ) : value ? (
              'Trocar imagem'
            ) : (
              'Enviar imagem'
            )}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="inline-flex items-center gap-1 text-xs font-medium text-cocoa-500 hover:text-terracotta-600"
            >
              <X className="h-3.5 w-3.5" /> Remover
            </button>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleFile(file)
            e.target.value = ''
          }}
        />
      </div>
      {error && <p className="mt-2 text-xs text-terracotta-600">{error}</p>}
    </div>
  )
}
