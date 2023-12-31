import '../styles/globals.css'
import { Inter } from 'next/font/google'
import Header from '@/components/ui/header'
import Footer from '@/components/ui/footer'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
})

export const metadata = {
  title: 'MediScan',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <link rel="icon" href="/favicon.ico"/>
        <body className={`${inter.variable} font-inter antialiased bg-[#141414] text-white tracking-tight`}>
          <div className="flex flex-col min-h-screen overflow-hidden supports-[overflow:clip]:overflow-clip">
            <Header/>
            {children}
            <Footer/>
          </div>
        </body>
    </html>
  )
}