import type { Metadata } from 'next'

export type SeoRoute = {
  path: string
  title?: string
  description?: string
  publicReady?: boolean
}

export type SeoConfig = {
  siteName: string
  description: string
  locale: string
  language: string
  siteUrl?: URL
  socialImage?: URL
  indexingEnabled: boolean
}

export type WebSiteJsonLd = {
  '@context': 'https://schema.org'
  '@type': 'WebSite'
  name: string
  description: string
  url: string
}

const placeholderHosts = new Set(['example.com', 'example.org', 'example.net', 'localhost'])

function isPlaceholderHost(hostname: string): boolean {
  const host = hostname.toLowerCase()
  return (
    placeholderHosts.has(host) ||
    host === 'example' ||
    host.endsWith('.example.com') ||
    host.endsWith('.example.org') ||
    host.endsWith('.example.net') ||
    host.endsWith('.localhost') ||
    host.endsWith('.local') ||
    host.endsWith('.test') ||
    host.endsWith('.invalid') ||
    host.endsWith('.example') ||
    /^\d{1,3}(?:\.\d{1,3}){3}$/.test(host) ||
    host.startsWith('[')
  )
}

function isInvalidHost(hostname: string): boolean {
  return (
    isPlaceholderHost(hostname) ||
    !hostname.includes('.') ||
    hostname
      .split('.')
      .some(
        (label) =>
          label.length === 0 ||
          label.length > 63 ||
          !/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(label),
      )
  )
}

function configuredUrl(value: string | undefined, originOnly = false): URL | undefined {
  if (!value || value.trim() !== value || /^https:\/\/[^/?#]*@/i.test(value)) return undefined

  try {
    const url = new URL(value)
    if (
      url.protocol !== 'https:' ||
      url.username ||
      url.password ||
      (originOnly && (url.pathname !== '/' || url.search || url.hash)) ||
      isInvalidHost(url.hostname)
    ) {
      return undefined
    }
    return url
  } catch {
    return undefined
  }
}

export function getSeoConfig(env: Partial<NodeJS.ProcessEnv> = process.env): SeoConfig {
  const indexingEnabled = env.SEO_INDEXING_ENABLED === 'true'
  const siteUrl = configuredUrl(env.SITE_URL, true)

  if (indexingEnabled && !siteUrl) {
    throw new Error('SEO_INDEXING_ENABLED requires a valid HTTPS SITE_URL origin.')
  }

  return {
    siteName: env.SITE_NAME?.trim() ?? '',
    description: env.SITE_DESCRIPTION?.trim() ?? '',
    locale: env.SITE_LOCALE?.trim() || 'en_US',
    language: env.SITE_LANGUAGE?.trim() || 'en',
    siteUrl,
    socialImage: configuredUrl(env.SITE_SOCIAL_IMAGE_URL),
    indexingEnabled,
  }
}

export function createRouteMetadata(route: SeoRoute, config: SeoConfig): Metadata {
  const indexable = Boolean(config.indexingEnabled && config.siteUrl && route.publicReady)
  const canonical =
    indexable && config.siteUrl ? routeCanonical(route.path, config.siteUrl) : undefined
  const title = route.title ?? (route.path === '/' ? 'Home' : undefined)
  const socialTitle = route.title ?? (route.path === '/' ? config.siteName : undefined)
  const documentTitle = title
    ? title === config.siteName || !config.siteName
      ? title
      : `${title} | ${config.siteName}`
    : undefined
  const description = route.description ?? config.description

  return {
    ...(documentTitle ? { title: { absolute: documentTitle } } : {}),
    ...(description ? { description } : {}),
    ...(indexable ? { alternates: { canonical: canonical?.toString() } } : {}),
    robots: { index: indexable, follow: indexable },
    ...(indexable && canonical && socialTitle && description
      ? {
          openGraph: {
            title: socialTitle,
            description,
            type: 'website' as const,
            url: canonical.toString(),
            locale: config.locale,
            ...(config.siteName ? { siteName: config.siteName } : {}),
            ...(config.socialImage ? { images: [config.socialImage.toString()] } : {}),
          },
          twitter: {
            card: config.socialImage ? ('summary_large_image' as const) : ('summary' as const),
            title: socialTitle,
            description,
            ...(config.socialImage ? { images: [config.socialImage.toString()] } : {}),
          },
        }
      : {}),
  }
}

function routeCanonical(path: string, origin: URL): URL {
  if (!path.startsWith('/') || path.startsWith('//') || /[?#\\]/.test(path)) {
    throw new Error('SEO route paths must be same-origin absolute paths without query or fragment.')
  }

  const canonical = new URL(path, origin)
  if (canonical.origin !== origin.origin || canonical.pathname !== path) {
    throw new Error(
      'SEO route paths must resolve to their exact path on the configured SITE_URL origin.',
    )
  }

  return canonical
}

function hasConfiguredSiteIdentity(config: SeoConfig): boolean {
  return Boolean(config.indexingEnabled && config.siteUrl && config.siteName && config.description)
}

export function getHomepageStructuredData(
  publicReady: boolean,
  config: SeoConfig,
): WebSiteJsonLd | undefined {
  if (!publicReady || !hasConfiguredSiteIdentity(config) || !config.siteUrl) return undefined

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: config.siteName,
    description: config.description,
    url: config.siteUrl.toString(),
  }
}

export function serializeJsonLd(value: WebSiteJsonLd): string {
  return JSON.stringify(value).replace(/</g, '\\u003c')
}
