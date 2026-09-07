import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { SettingsProvider } from './context/SettingsContext'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import { PublicLayout } from './components/PublicLayout'

import { Home } from './pages/Home'
import { Sobre } from './pages/Sobre'
import { Catalogo } from './pages/Catalogo'
import { ProntaEntrega } from './pages/ProntaEntrega'
import { MonteSuaCaixa } from './pages/MonteSuaCaixa'
import { Feiras } from './pages/Feiras'
import { Encomendas } from './pages/Encomendas'
import { Presentes } from './pages/Presentes'
import { NotFound } from './pages/NotFound'

const AdminLogin = lazy(() => import('./admin/Login').then((m) => ({ default: m.AdminLogin })))
const AdminLayout = lazy(() => import('./admin/AdminLayout').then((m) => ({ default: m.AdminLayout })))
const ProtectedRoute = lazy(() =>
  import('./admin/ProtectedRoute').then((m) => ({ default: m.ProtectedRoute })),
)
const ProductsAdmin = lazy(() =>
  import('./admin/ProductsAdmin').then((m) => ({ default: m.ProductsAdmin })),
)
const ProductForm = lazy(() => import('./admin/ProductForm').then((m) => ({ default: m.ProductForm })))
const CategoriesAdmin = lazy(() =>
  import('./admin/CategoriesAdmin').then((m) => ({ default: m.CategoriesAdmin })),
)
const FairsAdmin = lazy(() => import('./admin/FairsAdmin').then((m) => ({ default: m.FairsAdmin })))
const FairForm = lazy(() => import('./admin/FairForm').then((m) => ({ default: m.FairForm })))
const SettingsAdmin = lazy(() =>
  import('./admin/SettingsAdmin').then((m) => ({ default: m.SettingsAdmin })),
)

function AdminFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream">
      <p className="text-cocoa-500">Carregando painel...</p>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SettingsProvider>
          <CartProvider>
            <Routes>
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/sobre" element={<Sobre />} />
                <Route path="/catalogo" element={<Catalogo />} />
                <Route path="/pronta-entrega" element={<ProntaEntrega />} />
                <Route path="/monte-sua-caixa" element={<MonteSuaCaixa />} />
                <Route path="/feiras" element={<Feiras />} />
                <Route path="/encomendas" element={<Encomendas />} />
                <Route path="/presentes" element={<Presentes />} />
                <Route path="*" element={<NotFound />} />
              </Route>

              <Route
                path="/admin/*"
                element={
                  <Suspense fallback={<AdminFallback />}>
                    <Routes>
                      <Route path="login" element={<AdminLogin />} />
                      <Route element={<ProtectedRoute />}>
                        <Route element={<AdminLayout />}>
                          <Route index element={<Navigate to="/admin/produtos" replace />} />
                          <Route path="produtos" element={<ProductsAdmin />} />
                          <Route path="produtos/novo" element={<ProductForm />} />
                          <Route path="produtos/:id" element={<ProductForm />} />
                          <Route path="categorias" element={<CategoriesAdmin />} />
                          <Route path="feiras" element={<FairsAdmin />} />
                          <Route path="feiras/novo" element={<FairForm />} />
                          <Route path="feiras/:id" element={<FairForm />} />
                          <Route path="configuracoes" element={<SettingsAdmin />} />
                        </Route>
                      </Route>
                    </Routes>
                  </Suspense>
                }
              />
            </Routes>
          </CartProvider>
        </SettingsProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
