import type { Metadata } from 'next'

import './globals.css'
import { Header } from '@/components/layout/Header'
import { MobileNav } from '@/components/layout/MobileNav'
import { StoreProvider } from '@/components/layout/StoreProvider'


export const metadata: Metadata = {
  title:       'CineScope — Discover Movies & Series',
  description: 'Explore trending movies and TV shows powered by TMDB',
  keywords:    ['movies', 'series', 'TV shows', 'TMDB', 'streaming'],
  openGraph: {
    title:       'CineScope',
    description: 'Discover trending movies & TV shows',
    type:        'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Playfair+Display:ital,wght@0,700;0,900;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {/* Ambient layers rendered by body::before / body::after in globals.css */}

        <StoreProvider>
        <Header />

        {/* Page content — z-index above ambient layers */}
        <div className="relative z-[1]">
          {children}
        </div>

        {/* Mobile bottom navigation */}
        <MobileNav />

        {/* Footer */}
        <footer className="relative z-[1] bg-deep border-t border-white/[0.055] py-6 pb-[calc(1.5rem+62px)] md:pb-6">
          <div className="flex items-center justify-center gap-3 text-[0.7rem] text-white/22 uppercase tracking-widest">
            <span
              className="font-display text-base tracking-widest
                bg-gradient-to-r from-violet-glow to-yellow-400 bg-clip-text text-transparent opacity-50"
            >
              CineScope
            </span>
            <span className="opacity-30">·</span>
            <span>Powered by TMDB</span>
            <span className="opacity-30">·</span>
            <span>&copy; {new Date().getFullYear()}</span>
          </div>
        </footer>

        </StoreProvider>
      </body>
    </html>
  )
}
