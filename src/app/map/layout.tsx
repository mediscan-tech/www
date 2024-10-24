"use client";
import Navbar from "@/components/ui/navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="fixed grow">
        <Navbar />
        {children}
      </main>
    </>
  );
}
