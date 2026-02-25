import mixpanel from 'mixpanel-browser'

const TOKEN = 'a15e150aa4fe879ffb226695b5f0a567'
let initialized = false

export function initAnalytics(app: string = 'dytto-site') {
  if (initialized || typeof window === 'undefined') return
  mixpanel.init(TOKEN, { debug: false, track_pageview: false, persistence: 'localStorage' })
  mixpanel.register({ app, environment: 'production' })
  initialized = true
}

export function trackPage(name: string, props: Record<string, unknown> = {}) {
  if (!initialized) return
  mixpanel.track('Page View', { page: name, ...props })
}

export function track(event: string, props: Record<string, unknown> = {}) {
  if (!initialized) return
  mixpanel.track(event, props)
}

export function identify(userId: string, traits: Record<string, unknown> = {}) {
  if (!initialized) return
  mixpanel.identify(userId)
  if (Object.keys(traits).length) mixpanel.people.set(traits)
}
