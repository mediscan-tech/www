import '../styles/globals.css'
import { Inter } from 'next/font/google'
import Footer from '@/components/ui/footer'
import Navbar from '@/components/ui/navbar'
import localFont from "next/font/local"
import { BackgroundGradientAnimation } from '@/components/ui/background-gradient-animation'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
})

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  display: "swap"
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  display: "swap"
});
const mont = localFont({
  src: "./fonts/MontBold.woff",
  variable: "--font-mont",
  display: "swap"
});

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
      <link rel="icon" href="/favicon.svg" style={{ color: "red" }} />
      <body className={`${inter.variable} ${geistMono.variable} ${geistSans.variable} ${mont.variable} font-geist antialiased bg-bg text-text tracking-tight`}>
        <div className='w-screen h-screen fixed top-0 bottom-0 right-0 left-0 opacity-25 z-0'>
          <BackgroundGradientAnimation />
        </div>
        <Navbar />
        <div className='absolute z-20'>
          {children}
          <Footer />
        </div>
      </body>
    </html>
  )
}
