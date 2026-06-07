import type { Metadata } from 'next'
import { Inter, Barlow_Condensed, Playfair_Display, Bricolage_Grotesque } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import SmoothScrollProvider from '@/components/smooth-scroll-provider'
import { LanguageProvider } from '@/context/language-context'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  variable: '--font-barlow',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
})

// Bricolage Grotesque — modern editorial display, perfect for industrial premium
const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'HeavyForce Mongolia | Premium Industrial Equipment',
  description: 'Mongolia\'s premier supplier of heavy industrial machinery. Excavators, bulldozers, cranes, dump trucks and more — engineered for extreme conditions.',
  generator: 'v0.app',
  keywords: ['heavy machinery', 'Mongolia', 'excavators', 'bulldozers', 'industrial equipment', 'mining equipment'],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${barlowCondensed.variable} ${playfair.variable} ${bricolage.variable} bg-background`}>
      <body className="font-sans antialiased">
        <LanguageProvider>
          <SmoothScrollProvider>
            {children}
          </SmoothScrollProvider>
        </LanguageProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
