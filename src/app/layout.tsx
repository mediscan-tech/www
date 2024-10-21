import '../styles/globals.css'
import { Inter } from 'next/font/google'
import Footer from '@/components/ui/footer'
import Navbar from '@/components/ui/navbar'
import localFont from "next/font/local"
import { BackgroundGradientAnimation } from '@/components/ui/background-gradient-animation'
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";

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
        <ClerkProvider>
          <Navbar />
          <div className='absolute z-20'>
            {children}
            <Toaster />
            <Footer />
          </div>
        </ClerkProvider>
      </body>
    </html>
  )
}
