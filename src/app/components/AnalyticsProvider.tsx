'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import mixpanel from 'mixpanel-browser'

const TOKEN = 'a15e150aa4fe879ffb226695b5f0a567'
let initialized = false

function init() {
  if (initialized || typeof window === 'undefined') return
  mixpanel.init(TOKEN, { debug: false, track_pageview: false, persistence: 'localStorage' })
  mixpanel.register({ app: 'dytto-site', environment: 'production' })
  initialized = true
}

export default function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  useEffect(() => { init() }, [])

  useEffect(() => {
    if (!initialized) return
    const page = pathname === '/' ? 'Home'
      : pathname.startsWith('/blog/') ? `Blog Post: ${pathname.replace('/blog/', '')}`
      : pathname.charAt(1).toUpperCase() + pathname.slice(2)
    mixpanel.track('Page View', { page, path: pathname })
  }, [pathname])

  return <>{children}</>
}
