import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Category, Fair, Product } from '../types'

export function useCategories() {
  const [data, setData] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true })
      .then(({ data, error }) => {
        if (!error && data) setData(data)
        setLoading(false)
      })
  }, [])

  return { data, loading }
}

export function useProducts(filter?: {
  categorySlug?: string
  readyToShip?: boolean
  giftable?: boolean
  boxOption?: boolean
  featured?: boolean
}) {
  const [data, setData] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let query = supabase
      .from('products')
      .select('*, categories(slug)')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (filter?.readyToShip) query = query.eq('is_ready_to_ship', true)
    if (filter?.giftable) query = query.eq('is_giftable', true)
    if (filter?.boxOption) query = query.eq('is_box_option', true)
    if (filter?.featured) query = query.eq('is_featured', true)

    query.then(({ data, error }) => {
      if (!error && data) {
        let rows = data as unknown as (Product & { categories: { slug: string } | null })[]
        if (filter?.categorySlug) {
          rows = rows.filter((p) => p.categories?.slug === filter.categorySlug)
        }
        setData(rows)
      }
      setLoading(false)
    })
  }, [filter?.categorySlug, filter?.readyToShip, filter?.giftable, filter?.boxOption, filter?.featured])

  return { data, loading }
}

export function useFairs() {
  const [data, setData] = useState<Fair[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('fairs')
      .select('*')
      .eq('is_active', true)
      .order('event_date', { ascending: true })
      .then(({ data, error }) => {
        if (!error && data) setData(data)
        setLoading(false)
      })
  }, [])

  return { data, loading }
}
