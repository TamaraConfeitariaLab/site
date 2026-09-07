import { Award, Heart, Leaf, Users } from 'lucide-react'
import { useSettings } from '../context/SettingsContext'

const VALUES = [
  { icon: Heart, title: 'Feito com carinho', text: 'Cada receita é preparada em pequenos lotes, com atenção a cada detalhe.' },
  { icon: Leaf, title: 'Ingredientes selecionados', text: 'Trabalhamos com ingredientes de qualidade para garantir o melhor sabor.' },
  { icon: Users, title: 'Negócio familiar', text: 'Uma história construída em família, com muito orgulho e dedicação.' },
  { icon: Award, title: 'Produção artesanal', text: 'Sem produção em massa: cada cookie e brownie é feito à mão.' },
]

export function Sobre() {
  const { settings } = useSettings()

  return (
    <div className="container-page py-16 md:py-24">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-terracotta-500">
            Nossa história
          </p>
          <h1 className="mt-2 font-display text-4xl font-semibold text-cocoa-800 sm:text-5xl">
            Sobre a Tamara Confeitaria Lab
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-cocoa-600">{settings.about_text}</p>
          <p className="mt-4 leading-relaxed text-cocoa-600">
            Hoje levamos nossos cookies e brownies para feiras, eventos e para a casa de quem
            confia na gente para adoçar momentos especiais — sejam eles para presentear alguém
            ou para aquele mimo de fim de semana.
          </p>
        </div>
        <div className="overflow-hidden rounded-[2rem] shadow-xl">
          <img
            src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80"
            alt="Produção artesanal de cookies e brownies"
            className="aspect-[4/3] w-full object-cover"
          />
        </div>
      </div>

      <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {VALUES.map(({ icon: Icon, title, text }) => (
          <div key={title} className="card p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-terracotta-50 text-terracotta-500">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold text-cocoa-800">{title}</h3>
            <p className="mt-2 text-sm text-cocoa-500">{text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
