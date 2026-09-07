import { Calendar, Clock, MapPin } from 'lucide-react'
import { useFairs } from '../hooks/useSupabaseQuery'
import { formatDate } from '../lib/format'

export function Feiras() {
  const { data: fairs, loading } = useFairs()

  return (
    <div className="container-page py-16 md:py-20">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-terracotta-500">
          Loja itinerante
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-cocoa-800">
          Onde estaremos
        </h1>
        <p className="mt-4 text-cocoa-600">
          Confira as próximas feiras e eventos onde você pode encontrar a Tamara Confeitaria
          Lab pessoalmente.
        </p>
      </div>

      <div className="mt-10">
        {loading ? (
          <p className="text-cocoa-500">Carregando...</p>
        ) : fairs.length === 0 ? (
          <div className="card p-10 text-center text-cocoa-500">
            Nenhuma feira agendada no momento. Siga nosso Instagram para não perder as
            próximas novidades!
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {fairs.map((fair) => (
              <div key={fair.id} className="card flex overflow-hidden">
                {fair.image_url && (
                  <div className="hidden w-36 shrink-0 sm:block">
                    <img src={fair.image_url} alt={fair.title} className="h-full w-full object-cover" />
                  </div>
                )}
                <div className="flex-1 p-5">
                  <h3 className="font-display text-lg font-semibold text-cocoa-800">
                    {fair.title}
                  </h3>
                  <div className="mt-3 flex flex-col gap-2 text-sm text-cocoa-600">
                    {fair.event_date && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 shrink-0 text-terracotta-500" />
                        {formatDate(fair.event_date)}
                      </div>
                    )}
                    {(fair.start_time || fair.end_time) && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 shrink-0 text-terracotta-500" />
                        {fair.start_time}
                        {fair.end_time ? ` – ${fair.end_time}` : ''}
                      </div>
                    )}
                    {fair.location && (
                      <div className="flex items-start gap-2">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-terracotta-500" />
                        <span>
                          {fair.location}
                          {fair.address ? ` — ${fair.address}` : ''}
                        </span>
                      </div>
                    )}
                  </div>
                  {fair.maps_url && (
                    <a
                      href={fair.maps_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-block text-sm font-semibold text-terracotta-600 hover:underline"
                    >
                      Ver no mapa →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
