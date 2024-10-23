"use client";

import Footer from "@/components/ui/footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="grow">
        {children}
        <Footer />
      </main>
    </>
  );
}
