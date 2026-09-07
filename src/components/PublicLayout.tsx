import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { WhatsAppFloatButton } from './WhatsAppFloatButton'
import { CartDrawer } from './CartDrawer'

export function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFloatButton />
      <CartDrawer />
    </div>
  )
}
