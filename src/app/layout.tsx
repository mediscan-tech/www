import "../styles/globals.css";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  display: "swap",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  display: "swap",
});
const mont = localFont({
  src: "./fonts/MontBold.woff",
  variable: "--font-mont",
  display: "swap",
});

export const metadata = {
  title: "MediScan",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <link rel="icon" href="/favicon.svg" style={{ color: "red" }} />
      <body
        className={`${inter.variable} ${geistMono.variable} ${geistSans.variable} ${mont.variable} bg-bg font-geist tracking-tight text-text antialiased overflow-y-auto overflow-x-clip`}
      >
        <ClerkProvider>
          <div className="absolute z-20">
            {children}
            <Toaster />
          </div>
        </ClerkProvider>
      </body>
    </html>
  );
}
