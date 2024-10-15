'use client'
import Logo from "./logo"

export default function Navbar() {
  return (
    <nav className="fixed top-0 right-0 left-0 h-20 flex items-center z-40">
      <button className="h-full pl-4 flex items-center">
        <Logo backgroundColor="transparent" className="w-12 h-12"></Logo>
        <p className="font-mont text-3xl">Mediscan</p>
      </button>

      <div className="w-full"></div>

      <div className="px-2.5">About</div>
      <div className="px-2.5">Problem</div>
      <div className="px-2.5 pr-5">Solution</div>

      <div className="h-10 px-8 rounded-lg mr-5 flex items-center whitespace-nowrap font-semibold border-2 border-text text-sm">Find Healthcare</div>
      <div className="h-10 px-8 rounded-lg mr-5 flex items-center whitespace-nowrap font-semibold border-2 border-text text-sm">Self-Diagnose</div>
    </nav>
  )
}
