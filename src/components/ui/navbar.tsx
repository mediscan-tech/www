'use client';
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
} from '@clerk/nextjs';

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
        "fixed top-4 inset-x-0 max-w-7xl px-4 mx-auto z-50 backdrop-blur-sm",
        className
      )}
    >
      <Menu setActive={setActive}>
        {/* Left Side: Logo and Links */}
        <div className="relative flex items-center">
          <Logo backgroundColor="transparent" className="w-10 h-10" />
          <p className="font-mont text-primary text-2xl ml-2">Mediscan</p>
          <Link href={"/"} className="absolute inset-0 z-20"></Link>
        </div>

        {/* Center: Navigation Links */}
        <div className="flex space-x-8 font-medium text-sm">
          <Link href={"/directory"} className="hover:opacity-80 transition-all duration-200">
            Services
          </Link>
          <Link href={"/#about"} className="hover:opacity-80 transition-all duration-200">
            About
          </Link>
          <Link href={"/#contact"} className="hover:opacity-80 transition-all duration-200">
            Contact
          </Link>
        </div>

        {/* Right Side: Get Started Button and Clerk Authentication */}
        <div className="flex items-center space-x-4">
          <Link href={"/directory"}>
            <div className="border py-2 px-8 rounded-xl border-primary/80 bg-primary/10 text-primary font-medium text-sm">
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
