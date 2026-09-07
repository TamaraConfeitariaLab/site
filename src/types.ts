export type Category = {
  id: string
  slug: string
  name: string
  sort_order: number
  created_at: string
}

export type Product = {
  id: string
  slug: string
  name: string
  description: string | null
  price_cents: number
  category_id: string | null
  image_url: string | null
  is_ready_to_ship: boolean
  is_giftable: boolean
  is_box_option: boolean
  is_featured: boolean
  is_active: boolean
  stock_qty: number | null
  sort_order: number
  created_at: string
  updated_at: string
}

export type Fair = {
  id: string
  title: string
  event_date: string | null
  start_time: string | null
  end_time: string | null
  location: string | null
  address: string | null
  maps_url: string | null
  image_url: string | null
  is_active: boolean
  sort_order: number
  created_at: string
}

export type SiteSettings = Record<string, string>

export const DEFAULT_SETTINGS: SiteSettings = {
  whatsapp_number: '5511999999999',
  instagram_url: 'https://instagram.com',
  hero_title: 'Doces feitos para transformar uma pausa em um momento especial.',
  hero_subtitle:
    'Cookies, brownies, caixas para presente e encomendas preparados artesanalmente pela Tamara Confeitaria Lab.',
  about_text:
    'A Tamara Confeitaria Lab nasceu da paixão por transformar ingredientes simples em momentos especiais. Cada cookie e brownie é feito à mão, em pequenos lotes, com muito carinho e atenção aos detalhes.',
  city: 'São Paulo',
}
