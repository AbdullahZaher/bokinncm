import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from './components/Header'
import Footer from './components/Footer'
import AuthLayout from './components/AuthLayout'
import { Toaster } from './components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Bokinn - Modern Property Management Platform',
  description: 'Create your platform and manage your property on the cloud and in minutes',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://your-domain.com',
    siteName: 'Bokinn',
    title: 'Bokinn - Modern Property Management Platform',
    description: 'Create your platform and manage your property on the cloud and in minutes',
    images: [
      {
        url: '/imgs/og-image.png', // Make sure this image exists in your public folder
        width: 1200,
        height: 630,
        alt: 'Bokinn Platform',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <Header />
        <main className="flex-grow">
          <AuthLayout>
            {children}
          </AuthLayout>
        </main>
        <Footer />
        <Toaster />
      </body>
    </html>
  )
}

