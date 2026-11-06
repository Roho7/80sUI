import "./globals.css"

import type { Metadata, Viewport } from "next"
import { Silkscreen, VT323 } from "next/font/google"

import { ThemeProvider } from "@/components/theme-provider"
import { Ui95Sounds } from "@/components/ui/ui95-sounds"
import { BRAND_INKS } from "@/lib/brand/keycap"
import { SITE_AUTHOR, SITE_DESCRIPTION, SITE_KEYWORDS, SITE_NAME, SITE_TAGLINE, SITE_TWITTER, SITE_URL } from "@/lib/site"
import { cn } from "@/lib/utils"

const fontPixel = Silkscreen({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-display",
})

const fontMono = VT323({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-body",
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME}: ${SITE_TAGLINE}`, template: `%s / ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: SITE_KEYWORDS,
  authors: [SITE_AUTHOR],
  creator: SITE_AUTHOR.name,
  category: "technology",
  robots: { index: true, follow: true },
  openGraph: {
    siteName: SITE_NAME,
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    title: `${SITE_NAME}: ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    creator: SITE_TWITTER,
    title: `${SITE_NAME}: ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
  },
}

export const viewport: Viewport = {
  themeColor: BRAND_INKS.ink0,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      data-theme="phosphor"
      suppressHydrationWarning
      className={cn(fontPixel.variable, fontMono.variable)}
    >
      <body>
        <ThemeProvider defaultTheme="light" enableSystem={false}>
          {children}
          <Ui95Sounds />
        </ThemeProvider>
      </body>
    </html>
  )
}
