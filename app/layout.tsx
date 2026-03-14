import type { Metadata } from 'next'
import { Geist, Geist_Mono, Bangers } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeToggle } from '../components/theme-toggle'
import { LoadingScreen } from '../components/loading-screen'
import './globals.css'

const geist = Geist({
  subsets: ["latin"],
  variable: '--font-geist'
});
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: '--font-geist-mono'
});
const bangers = Bangers({
  weight: '400',
  subsets: ["latin"],
  variable: '--font-bangers'
});

export const metadata: Metadata = {
  title: 'Dark Knight Studios | Graphic Design Portfolio',
  description: 'A comic book inspired portfolio showcasing graphic design work with a dark Gotham aesthetic',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

import { ThemeProvider } from '../components/theme-provider'
import { PageTurnProvider } from '../components/page-turn-provider'
import { ComicCursor } from '../components/comic-cursor'
import { FilmGrain } from '../components/film-grain'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geist.variable} ${geistMono.variable} ${bangers.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="batman"
          enableSystem={false}
          themes={['batman', 'joker']}
        >
          <PageTurnProvider>
            <ComicCursor />
            <FilmGrain />
            <LoadingScreen />
            {children}
            <Analytics />
          </PageTurnProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}