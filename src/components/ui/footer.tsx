import Link from "next/link";
import { TextHoverEffect } from "./text-hover-effect";

export default function Footer() {
  return (
    <div className="border-t-2 border-bg-light bg-bg-light/40 pt-8 flex flex-col items-center">
      <div className="flex w-[85vw] justify-between">
        <div>
          <h1 className="text-text-light text-xl font-medium pt-4">Contact</h1>
          <p className="mt-2 text-sm">john.doe@mediscan.tech</p>
          <p className="mt-1 text-sm">(234) 567 8910</p>
        </div>
        <div>
          <h1 className="text-text-light text-xl font-medium pt-4">Large Language Models</h1>
          <p className="mt-2 text-sm">General Diagnosis</p>
          <p className="mt-1 text-sm">First-Aid Advice</p>
          <p className="mt-1 text-sm">Health Risk Prediction</p>
        </div>
        <div>
          <h1 className="text-text-light text-xl font-medium pt-4">Machine Learning Models</h1>
          <p className="mt-2 text-sm">Hair & Scalp Conditions</p>
          <p className="mt-1 text-sm">Oral Wellness</p>
          <p className="mt-1 text-sm">Skin Conditions & Disease</p>
        </div>
        <div>
          <h1 className="text-text-light text-xl font-medium pt-4">More From Mediscan</h1>
          <p className="mt-2 text-sm">Nearby Hospital Wait Times</p>
          <p className="mt-1 text-sm">Telemedicine Service</p>
        </div>
      </div>
      <div className="bg-bg-light h-0.5 w-[90vw] my-8"></div>
      <div className="relative h-[13vw] w-screen flex items-center justify-center overflow-clip opacity-70">
        <div className="absolute z-10 top-0 right-0 left-0 bottom-0 w-full h-full bg-gradient-to-b from-transparent to-bg"></div>
        <p className="text-[16vw] font-extrabold font-mont text-primary translate-y-[0.75vw] translate-x-[0.5vw]">MEDISCAN</p>
      </div>
      <div className="h-24 z-40 flex items-center justify-center w-screen bg-bg">
        <div className="w-[85vw] h-12 flex">

        </div>
      </div>
    </div>
  )
}