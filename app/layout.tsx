import "./globals.css"

import type { Metadata } from "next"
import { Silkscreen, VT323 } from "next/font/google"

import { ThemeProvider } from "@/components/theme-provider"
import { NostalguiSounds } from "@/components/ui/nostalgui-sounds"
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/site"
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
  title: { default: SITE_NAME, template: `%s / ${SITE_NAME}` },
  description: SITE_TAGLINE,
  openGraph: { siteName: SITE_NAME, type: "website" },
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
          <NostalguiSounds />
        </ThemeProvider>
      </body>
    </html>
  )
}
