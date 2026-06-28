import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { ThemeProvider } from '@/src/shared/providers/theme-provider'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Portal do Colaborador',
  description: 'Sistema de gestão de solicitações de folgas',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh bg-background font-sans antialiased">
        <ThemeProvider defaultTheme="system" storageKey="portal-theme">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
