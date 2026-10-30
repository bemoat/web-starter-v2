import React from 'react'
import type { Metadata } from 'next'

import { getSeoConfig } from '@/lib/seo'
import './styles.css'

const seo = getSeoConfig()
const description = seo.description || 'A blank template using Payload in a Next.js app.'
const siteName = seo.siteName || 'Payload Blank Template'

export const metadata: Metadata = {
  description,
  ...(seo.siteUrl ? { metadataBase: seo.siteUrl } : {}),
  robots: { index: false, follow: false },
  title: { default: siteName, template: `%s | ${siteName}` },
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang={seo.language}>
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}
