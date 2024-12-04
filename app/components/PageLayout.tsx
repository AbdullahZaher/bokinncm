import { headers } from 'next/headers'
import Header from './Header'
import Footer from './Footer'

export default function PageLayout({ children }: { children: React.ReactNode }) {
  const headersList = headers()
  const hideHeader = headersList.get('x-hide-header') === 'true'
  const hideFooter = headersList.get('x-hide-footer') === 'true'

  return (
    <>
      {!hideHeader && <Header />}
      <main>{children}</main>
      {!hideFooter && <Footer />}
    </>
  )
} 