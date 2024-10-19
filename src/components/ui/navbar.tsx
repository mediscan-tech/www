'use client'
import { useState } from "react";
import Logo from "./logo"
import { cn } from "@/lib/utils";
import { HoveredLink, Menu, MenuItem, ProductItem } from "./navbar-menu";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Navbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1
      }}
      transition={{
        ease: "easeInOut",
        duration: 1,
      }}
      className={cn("fixed top-4 inset-x-0 max-w-6xl mx-auto z-50", className)}
    >
      <Menu setActive={setActive}>
        <div className="relative">
          <div className="flex items-center">
            <Logo backgroundColor="transparent" className="w-10 h-10" />
            <p className="font-mont text-primary text-2xl translate-y-0.5">Mediscan</p>
          </div>
          <Link href={"/"} className="absolute top-0 right-0 left-0 bottom-0 z-20"></Link>
        </div>
        <div className="flex space-x-6 absolute w-full justify-center items-center -left-3 font-medium text-sm">
          <MenuItem setActive={setActive} active={active} item="Self-Diagnose" >
            <div className="flex flex-col space-y-4 text-md">
              <HoveredLink href="/mouth">Diagnose Mouth Disease</HoveredLink>
              <HoveredLink href="/skin">Diagnose Skin Disease</HoveredLink>
            </div>
          </MenuItem>
          <Link href={"/wait-times"} className="hover:opacity-80 transition-all duration-200">Wait Times</Link>
          <Link href={"/#about"} className="hover:opacity-80 transition-all duration-200">About</Link>
          <Link href={"/#contact"} className="hover:opacity-80 transition-all duration-200">Contact</Link>
        </div>
        <div className="border py-2 px-8 rounded-xl border-primary/80 bg-primary/10 text-text-light font-medium text-sm flex items-center justify-center relative">
          Get Started!
          <Link href={"/start"} className="absolute z-20 top-0 left-0 bottom-0 right-0"></Link>
        </div>
      </Menu>
    </motion.div>
  );
}
