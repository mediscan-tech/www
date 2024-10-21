"use client";
import { useState } from "react";
import Logo from "./logo";
import { cn } from "@/lib/utils";
import { HoveredLink, Menu, MenuItem } from "./navbar-menu";
import Link from "next/link";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";

const UserButton = dynamic(() => import("./user-button"), { ssr: false });

export default function Navbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);

  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      transition={{
        ease: "easeInOut",
        duration: 1,
      }}
      className={cn(
        "fixed inset-x-0 top-4 z-50 mx-auto max-w-7xl px-4 backdrop-blur-sm",
        className
      )}
    >
      <Menu setActive={setActive}>
        {/* Left Side: Logo and Links */}
        <div className="relative flex items-center">
          <Logo backgroundColor="transparent" className="h-10 w-10" />
          <p className="ml-2 font-mont text-2xl text-primary">Mediscan</p>
          <Link href={"/"} className="absolute inset-0 z-20"></Link>
        </div>

        {/* Center: Navigation Links */}
        <div className="flex space-x-8 text-sm font-medium">
          <Link
            href={"/directory"}
            className="transition-all duration-200 hover:opacity-80"
          >
            Services
          </Link>
          <Link
            href={"/#about"}
            className="transition-all duration-200 hover:opacity-80"
          >
            About
          </Link>
          <Link
            href={"/#contact"}
            className="transition-all duration-200 hover:opacity-80"
          >
            Contact
          </Link>
        </div>

        {/* Right Side: Get Started Button and Clerk Authentication */}
        <div className="flex items-center space-x-4">
          <Link href={"/directory"}>
            <div className="rounded-xl border border-primary/80 bg-primary/10 px-8 py-2 text-sm font-medium text-primary">
              Get Started!
            </div>
          </Link>

          {/* Clerk Authentication (SignIn or UserButton) */}
            <SignedOut>
              <SignInButton mode="modal" />
            </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
        </div>
      </Menu>
    </motion.div>
  );
}
