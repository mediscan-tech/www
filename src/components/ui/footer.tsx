import { TextHoverEffect } from "./text-hover-effect";

export default function Footer() {
  return (
    <div className="">
      <div className="relative h-[13vw] w-screen flex items-center justify-center overflow-clip">
        <div className="absolute z-10 top-0 right-0 left-0 bottom-0 w-full h-full bg-gradient-to-b from-transparent to-bg/80"></div>
        <div className="absolute z-10 top-0 right-0 left-0 bottom-0 w-full h-full bg-gradient-to-b from-transparent to-bg"></div>
        <p className="text-[16vw] font-extrabold font-mont text-primary translate-y-2">MEDISCAN</p>
      </div>
      <div className="h-24 z-40 flex items-center justify-center w-screen bg-bg">

      </div>
    </div>
  )
}