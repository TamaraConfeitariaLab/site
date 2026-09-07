import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import { DEFAULT_SETTINGS, type SiteSettings } from '../types'

type SettingsContextValue = {
  settings: SiteSettings
  loading: boolean
  refresh: () => Promise<void>
}

const SettingsContext = createContext<SettingsContextValue>({
  settings: DEFAULT_SETTINGS,
  loading: true,
  refresh: async () => {},
})

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)

  async function refresh() {
    const { data, error } = await supabase.from('site_settings').select('key, value')
    if (!error && data) {
      const merged: SiteSettings = { ...DEFAULT_SETTINGS }
      for (const row of data) {
        if (row.value != null) merged[row.key] = row.value
      }
      setSettings(merged)
    }
    setLoading(false)
  }

  useEffect(() => {
    refresh()
  }, [])

  return (
    <SettingsContext.Provider value={{ settings, loading, refresh }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  return useContext(SettingsContext)
}
