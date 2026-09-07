import { useState, type FormEvent } from 'react'
import { CalendarClock, ClipboardList, MessageCircle, PackageCheck } from 'lucide-react'
import { useSettings } from '../context/SettingsContext'
import { whatsappLink } from '../lib/whatsapp'

const STEPS = [
  {
    icon: ClipboardList,
    title: 'Conte sua ideia',
    text: 'Preencha o formulário ou nos chame no WhatsApp com detalhes do seu pedido.',
  },
  {
    icon: CalendarClock,
    title: 'Combinamos os detalhes',
    text: 'Definimos sabores, quantidade, data de entrega e forma de pagamento.',
  },
  {
    icon: PackageCheck,
    title: 'Você recebe fresquinho',
    text: 'Preparamos tudo artesanalmente e entregamos (ou combinamos retirada) no prazo.',
  },
]

export function Encomendas() {
  const { settings } = useSettings()
  const [name, setName] = useState('')
  const [date, setDate] = useState('')
  const [details, setDetails] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const message = [
      `Olá! Meu nome é ${name || '(seu nome)'} e gostaria de fazer uma encomenda.`,
      date ? `Data desejada: ${date}` : null,
      details ? `Detalhes: ${details}` : null,
    ]
      .filter(Boolean)
      .join('\n')
    window.open(whatsappLink(settings.whatsapp_number, message), '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="container-page py-16 md:py-20">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-terracotta-500">
          Encomendas
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-cocoa-800">
          Vamos planejar sua encomenda
        </h1>
        <p className="mt-4 text-cocoa-600">
          Ideal para aniversários, casamentos, eventos corporativos ou aquele mimo especial.
          Conte pra gente o que você imagina e cuidamos do resto.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        {STEPS.map(({ icon: Icon, title, text }) => (
          <div key={title} className="card p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-terracotta-50 text-terracotta-500">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold text-cocoa-800">{title}</h3>
            <p className="mt-2 text-sm text-cocoa-500">{text}</p>
          </div>
        ))}
      </div>

      <div className="mt-14 grid gap-10 lg:grid-cols-2">
        <form onSubmit={handleSubmit} className="card flex flex-col gap-4 p-6 sm:p-8">
          <h2 className="font-display text-xl font-semibold text-cocoa-800">
            Solicitar orçamento
          </h2>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-cocoa-700">Seu nome</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-cocoa-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-terracotta-400"
              placeholder="Como podemos te chamar?"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-cocoa-700">
              Data desejada
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl border border-cocoa-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-terracotta-400"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-cocoa-700">
              Conte os detalhes
            </label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={4}
              className="w-full rounded-xl border border-cocoa-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-terracotta-400"
              placeholder="Quantidade, sabores, ocasião..."
            />
          </div>
          <button type="submit" className="btn btn-primary mt-2 justify-center">
            <MessageCircle className="h-4 w-4" /> Enviar pelo WhatsApp
          </button>
        </form>

        <div className="overflow-hidden rounded-[2rem] shadow-xl">
          <img
            src="https://images.unsplash.com/photo-1558326567-98ae2405596b?auto=format&fit=crop&w=900&q=80"
            alt="Caixa de encomenda de brownies e cookies"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  )
}
