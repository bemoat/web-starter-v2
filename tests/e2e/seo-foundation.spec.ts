import { expect, test } from '@playwright/test'

test('serves fail-closed homepage metadata and truthful discovery routes', async ({
  page,
  request,
}) => {
  await page.route('https://raw.githubusercontent.com/**', (route) => route.abort())
  const homepage = await page.goto('http://localhost:3000/')

  expect(homepage?.ok()).toBe(true)
  const expectedTitle = process.env.SITE_NAME ? `Home | ${process.env.SITE_NAME}` : 'Home'
  const expectedDescription =
    process.env.SITE_DESCRIPTION || 'A blank template using Payload in a Next.js app.'
  await expect(page).toHaveTitle(expectedTitle)
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content',
    expectedDescription,
  )
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex, nofollow/)
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0)
  await expect(page.locator('meta[property^="og:"]')).toHaveCount(0)
  await expect(page.locator('meta[name^="twitter:"]')).toHaveCount(0)
  await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(0)

  const robotsResponse = await request.get('http://localhost:3000/robots.txt')
  expect(robotsResponse.ok()).toBe(true)
  expect(robotsResponse.headers()['content-type']).toContain('text/plain')
  const robotsText = await robotsResponse.text()
  expect(robotsText).toContain('User-Agent: *')
  expect(robotsText).toContain('Allow: /')
  expect(robotsText).toContain('Disallow: /admin')
  expect(robotsText).toContain('Disallow: /admin/')
  expect(robotsText).toContain('Disallow: /api')
  expect(robotsText).toContain('Disallow: /api/')
  expect(robotsText).not.toContain('Sitemap:')

  const sitemapResponse = await request.get('http://localhost:3000/sitemap.xml')
  expect(sitemapResponse.ok()).toBe(true)
  expect(sitemapResponse.headers()['content-type']).toContain('xml')
  const sitemapXml = await sitemapResponse.text()
  expect(sitemapXml).toContain('<urlset')
  expect(sitemapXml).not.toContain('<url>')
  expect(sitemapXml).not.toContain('<loc>')
})
