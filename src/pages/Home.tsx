import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Cookie,
  Gift,
  Heart,
  MapPin,
  MessageCircle,
  Sparkles,
  Truck,
  Users,
} from 'lucide-react'
import { useProducts, useFairs } from '../hooks/useSupabaseQuery'
import { useSettings } from '../context/SettingsContext'
import { ProductCard } from '../components/ProductCard'
import { formatDate } from '../lib/format'

const FEATURES = [
  { icon: Cookie, label: 'Produção artesanal' },
  { icon: Users, label: 'Negócio familiar' },
  { icon: MapPin, label: 'Loja itinerante' },
  { icon: Heart, label: 'Encomendas' },
  { icon: Gift, label: 'Presentes' },
  { icon: MessageCircle, label: 'Pedidos pelo WhatsApp' },
]

export function Home() {
  const { settings } = useSettings()
  const { data: featured, loading } = useProducts({ featured: true })
  const { data: fairs } = useFairs()
  const nextFair = fairs[0]

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-terracotta-100 blur-3xl" />
        <div className="pointer-events-none absolute -left-40 top-60 h-80 w-80 rounded-full bg-blush-100 blur-3xl" />
        <div className="container-page relative grid items-center gap-12 py-16 md:py-24 lg:grid-cols-2">
          <div className="fade-in">
            <span className="inline-flex items-center gap-2 rounded-full border border-terracotta-200 bg-terracotta-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-terracotta-600">
              <Sparkles className="h-3.5 w-3.5" />
              Cookies e brownies artesanais em {settings.city}
            </span>
            <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.1] text-cocoa-800 sm:text-5xl lg:text-6xl">
              {settings.hero_title}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-cocoa-600">
              {settings.hero_subtitle}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/catalogo" className="btn btn-primary">
                Conhecer o catálogo <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/pronta-entrega" className="btn btn-secondary">
                Ver pronta entrega
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {FEATURES.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 rounded-full border border-cocoa-200 bg-white/70 px-3 py-2 text-xs font-medium text-cocoa-700"
                >
                  <Icon className="h-4 w-4 shrink-0 text-terracotta-500" />
                  {label}
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-[2rem] border-4 border-white shadow-2xl shadow-cocoa-900/10">
              <img
                src="https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=900&q=80"
                alt="Cookies e brownies artesanais Tamara Confeitaria Lab"
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
            <div className="card absolute -bottom-6 left-4 right-4 flex items-center gap-3 px-4 py-3 shadow-xl sm:left-8 sm:right-auto sm:w-72">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-cocoa-800 text-cream">
                <Heart className="h-5 w-5" />
              </div>
              <div>
                <p className="font-display text-sm font-semibold text-cocoa-800">
                  Tamara Confeitaria Lab
                </p>
                <p className="text-xs text-cocoa-500">Sabor que tá-maravilhoso!</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {nextFair && (
        <section className="container-page">
          <div className="flex flex-col items-center justify-between gap-4 rounded-2xl bg-cocoa-800 px-6 py-5 text-cream sm:flex-row">
            <div className="flex items-center gap-3">
              <Truck className="h-5 w-5 shrink-0 text-terracotta-300" />
              <p className="text-sm">
                <strong className="font-semibold">Próxima feira:</strong> {nextFair.title} —{' '}
                {formatDate(nextFair.event_date)}
                {nextFair.location ? ` · ${nextFair.location}` : ''}
              </p>
            </div>
            <Link to="/feiras" className="btn btn-secondary shrink-0 bg-cream text-cocoa-800 hover:bg-cream-dark">
              Ver todas as feiras
            </Link>
          </div>
        </section>
      )}

      {(loading || featured.length > 0) && (
        <section className="container-page py-16 md:py-20">
          <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-terracotta-500">
                Destaques
              </p>
              <h2 className="mt-2 font-display text-3xl font-semibold text-cocoa-800">
                Os queridinhos da casa
              </h2>
            </div>
            <Link to="/catalogo" className="btn btn-secondary">
              Ver catálogo completo <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      <section className="bg-cocoa-800 py-16 text-cream md:py-20">
        <div className="container-page grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <p className="text-sm font-semibold uppercase tracking-wide text-terracotta-300">
              Como funciona
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold">
              Do nosso forno para o seu momento
            </h2>
            <p className="mt-4 text-cream/70">
              Simples, artesanal e feito com carinho — do pedido até a entrega.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-3 lg:col-span-2">
            {[
              {
                step: '01',
                title: 'Escolha',
                text: 'Navegue pelo catálogo, pronta entrega ou monte sua caixa personalizada.',
              },
              {
                step: '02',
                title: 'Combine',
                text: 'Finalize os detalhes de pagamento e entrega direto pelo WhatsApp.',
              },
              {
                step: '03',
                title: 'Aproveite',
                text: 'Receba tudo fresquinho, feito artesanalmente com muito carinho.',
              },
            ].map((item) => (
              <div key={item.step} className="rounded-2xl border border-cream/10 bg-cream/5 p-5">
                <span className="font-display text-2xl font-semibold text-terracotta-300">
                  {item.step}
                </span>
                <h3 className="mt-3 font-display text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-cream/70">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-16 md:py-20">
        <div className="grid items-center gap-10 rounded-[2rem] bg-terracotta-50 p-8 md:grid-cols-2 md:p-14">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-terracotta-600">
              Presentes e caixas personalizadas
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-cocoa-800">
              Monte a caixa perfeita para presentear
            </h2>
            <p className="mt-4 text-cocoa-600">
              Escolha os sabores, a quantidade e deixe com a gente a parte de deixar tudo
              lindo e embalado com muito carinho.
            </p>
            <Link to="/monte-sua-caixa" className="btn btn-primary mt-6">
              Monte sua caixa <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="overflow-hidden rounded-2xl shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1607920591413-4ec007e70023?auto=format&fit=crop&w=800&q=80"
              alt="Caixa de presente com cookies e brownies"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
        </div>
      </section>
    </div>
  )
}
