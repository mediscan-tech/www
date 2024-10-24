"use client";

import Navbar from "@/components/ui/navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar className="max-w-7xl" />
      <main className="grow">{children}</main>
    </>
  );
}
