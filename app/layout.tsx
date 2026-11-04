import "./globals.css"

import type { Metadata } from "next"
import { Silkscreen, VT323 } from "next/font/google"

import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

const fontPixel = Silkscreen({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-silkscreen",
})

const fontMono = VT323({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-vt323",
})

export const metadata: Metadata = {
  title: "dither-ui",
  description: "Retro components for shadcn",
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
        </ThemeProvider>
      </body>
    </html>
  )
}
