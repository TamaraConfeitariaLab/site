import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <div className="container-page flex flex-col items-center justify-center py-32 text-center">
      <p className="font-display text-6xl font-semibold text-terracotta-400">404</p>
      <h1 className="mt-4 font-display text-2xl font-semibold text-cocoa-800">
        Página não encontrada
      </h1>
      <p className="mt-2 text-cocoa-500">A página que você procura não existe ou foi movida.</p>
      <Link to="/" className="btn btn-primary mt-6">
        Voltar para o início
      </Link>
    </div>
  )
}
