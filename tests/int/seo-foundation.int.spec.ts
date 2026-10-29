import { afterEach, describe, expect, it, vi } from 'vitest'

import robots from '../../src/app/robots'
import sitemap from '../../src/app/sitemap'
import {
  createRouteMetadata,
  getHomepageStructuredData,
  getSeoConfig,
  serializeJsonLd,
} from '../../src/lib/seo'

afterEach(() => vi.unstubAllEnvs())

describe('SEO foundation', () => {
  it.each([
    ['missing', undefined],
    ['empty', ''],
    ['whitespace', '   '],
    ['surrounding whitespace', ' https://tenant.bemoat.com '],
    ['malformed', 'https://[broken'],
    ['malformed hostname', 'https://tenant..bemoat.com'],
    ['localhost', 'https://localhost:3000'],
    ['loopback IP', 'https://127.0.0.1'],
    ['private IP', 'https://192.168.1.20'],
    ['placeholder domain', 'https://example.com'],
    ['placeholder subdomain', 'https://preview.example.org'],
    ['reserved test domain', 'https://site.test'],
    ['HTTP', 'http://tenant.bemoat.com'],
    ['credentials', 'https://user:pass@tenant.bemoat.com'],
    ['empty user information', 'https://@tenant.bemoat.com'],
    ['embedded path', 'https://tenant.bemoat.com/site'],
    ['query', 'https://tenant.bemoat.com?preview=true'],
    ['fragment', 'https://tenant.bemoat.com#preview'],
  ])('fails closed for %s origin values', (_label, siteUrl) => {
    const disabled = getSeoConfig({ SEO_INDEXING_ENABLED: 'false', SITE_URL: siteUrl })
    const metadata = createRouteMetadata({ path: '/', publicReady: true }, disabled)

    expect(disabled.siteUrl).toBeUndefined()
    expect(metadata.robots).toEqual({ index: false, follow: false })
    expect(metadata.alternates).toBeUndefined()
    expect(metadata.openGraph).toBeUndefined()
    expect(metadata.twitter).toBeUndefined()
    expect(() => getSeoConfig({ SEO_INDEXING_ENABLED: 'true', SITE_URL: siteUrl })).toThrow(
      /valid HTTPS SITE_URL origin/,
    )
  })

  it('accepts a canonical origin with an explicit HTTPS port and trailing slash', () => {
    const config = getSeoConfig({
      SEO_INDEXING_ENABLED: 'true',
      SITE_URL: 'https://tenant.bemoat.com:8443/',
      SITE_NAME: 'A real site',
      SITE_DESCRIPTION: 'A real description',
      SITE_SOCIAL_IMAGE_URL: 'https://cdn.bemoat.com/images/social-card.png',
    })
    const homepage = createRouteMetadata({ path: '/', publicReady: true }, config)
    const child = createRouteMetadata(
      { path: '/about', title: 'About', description: 'About this site.', publicReady: true },
      config,
    )

    expect(homepage.alternates?.canonical).toBe('https://tenant.bemoat.com:8443/')
    expect(homepage.title).toEqual({ absolute: 'Home | A real site' })
    expect(homepage.openGraph).toMatchObject({
      title: 'A real site',
      description: 'A real description',
      url: 'https://tenant.bemoat.com:8443/',
      images: ['https://cdn.bemoat.com/images/social-card.png'],
    })
    expect(homepage.twitter).toMatchObject({
      card: 'summary_large_image',
      title: 'A real site',
      images: ['https://cdn.bemoat.com/images/social-card.png'],
    })
    expect(child.alternates?.canonical).toBe('https://tenant.bemoat.com:8443/about')
    expect(child.title).toEqual({ absolute: 'About | A real site' })
    expect(child.alternates?.canonical).not.toBe(homepage.alternates?.canonical)
    expect(child.openGraph).toMatchObject({ title: 'About', description: 'About this site.' })
    expect(child.twitter).toMatchObject({ title: 'About', description: 'About this site.' })
    expect(
      createRouteMetadata(
        { path: '/contact', title: 'Contact', description: 'Contact details.', publicReady: true },
        getSeoConfig({
          SEO_INDEXING_ENABLED: 'true',
          SITE_URL: 'https://tenant.bemoat.com',
          SITE_DESCRIPTION: 'A real description',
        }),
      ).openGraph,
    ).not.toHaveProperty('siteName')
    expect(
      createRouteMetadata({ path: '/', publicReady: false }, config).alternates,
    ).toBeUndefined()
  })

  it('keeps an otherwise valid origin unpublished until explicit opt-in', () => {
    const config = getSeoConfig({
      SEO_INDEXING_ENABLED: 'false',
      SITE_URL: 'https://tenant.bemoat.com',
      SITE_NAME: 'A real site',
      SITE_DESCRIPTION: 'A real description',
    })
    const metadata = createRouteMetadata({ path: '/', publicReady: true }, config)

    expect(metadata.robots).toEqual({ index: false, follow: false })
    expect(metadata.alternates).toBeUndefined()
    expect(metadata.openGraph).toBeUndefined()
    expect(metadata.twitter).toBeUndefined()
  })

  it('never derives a canonical origin from host headers', () => {
    expect(() =>
      getSeoConfig({
        SEO_INDEXING_ENABLED: 'true',
        HOST: 'attacker.example.com',
        'x-forwarded-host': 'attacker.example.com',
      }),
    ).toThrow(/valid HTTPS SITE_URL origin/)
  })

  it.each([
    '//outside.example.com/path',
    'https://outside.example.com/path',
    '/about?preview=1',
    '/about#draft',
    '/about/../other',
    '/\\\\outside.example.com',
  ])('rejects unsafe canonical route path %s', (path) => {
    const config = getSeoConfig({
      SEO_INDEXING_ENABLED: 'true',
      SITE_URL: 'https://tenant.bemoat.com',
    })

    expect(() => createRouteMetadata({ path, publicReady: true }, config)).toThrow(
      /same-origin|exact path/,
    )
  })

  it('escapes script-breaking JSON-LD and emits no schema for the blank homepage', () => {
    const hostileName = '</script><script>alert(1)</script>'
    const structuredData = {
      '@context': 'https://schema.org' as const,
      '@type': 'WebSite' as const,
      name: hostileName,
      description: 'A real description',
      url: 'https://tenant.bemoat.com/',
    }
    const serialized = serializeJsonLd(structuredData)
    expect(serialized).not.toContain('</script>')
    expect(JSON.parse(serialized)).toEqual(structuredData)
    expect(
      getHomepageStructuredData(
        false,
        getSeoConfig({
          SEO_INDEXING_ENABLED: 'true',
          SITE_URL: 'https://tenant.bemoat.com',
          SITE_NAME: 'A real site',
          SITE_DESCRIPTION: 'A real description',
        }),
      ),
    ).toBeUndefined()
  })

  it('emits only a truthful WebSite object for a configured, opted-in public homepage', () => {
    const config = getSeoConfig({
      SEO_INDEXING_ENABLED: 'true',
      SITE_URL: 'https://tenant.bemoat.com',
      SITE_NAME: 'A real site',
      SITE_DESCRIPTION: 'A real description',
    })

    expect(getHomepageStructuredData(true, config)).toEqual({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'A real site',
      description: 'A real description',
      url: 'https://tenant.bemoat.com/',
    })
  })

  it('publishes no sitemap entries or sitemap declaration for the blank homepage', () => {
    vi.stubEnv('SEO_INDEXING_ENABLED', 'true')
    vi.stubEnv('SITE_URL', 'https://tenant.bemoat.com')

    expect(sitemap()).toEqual([])
    expect(robots().sitemap).toBeUndefined()
  })
})
