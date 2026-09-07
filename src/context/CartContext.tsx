import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Product } from '../types'

export type CartItem = {
  id: string
  name: string
  price_cents: number
  image_url: string | null
  qty: number
}

type CartContextValue = {
  items: CartItem[]
  addItem: (product: Product, qty?: number) => void
  removeItem: (id: string) => void
  setQty: (id: string, qty: number) => void
  clear: () => void
  totalCents: number
  totalQty: number
  isOpen: boolean
  open: () => void
  close: () => void
}

const CartContext = createContext<CartContextValue | null>(null)
const STORAGE_KEY = 'tcl_cart_v1'

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? (JSON.parse(raw) as CartItem[]) : []
    } catch {
      return []
    }
  })
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      /* storage unavailable, ignore */
    }
  }, [items])

  function addItem(product: Product, qty = 1) {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id)
      if (existing) {
        return prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + qty } : i))
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price_cents: product.price_cents,
          image_url: product.image_url,
          qty,
        },
      ]
    })
    setIsOpen(true)
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  function setQty(id: string, qty: number) {
    if (qty <= 0) {
      removeItem(id)
      return
    }
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)))
  }

  function clear() {
    setItems([])
  }

  const totalCents = items.reduce((sum, i) => sum + i.price_cents * i.qty, 0)
  const totalQty = items.reduce((sum, i) => sum + i.qty, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        setQty,
        clear,
        totalCents,
        totalQty,
        isOpen,
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
