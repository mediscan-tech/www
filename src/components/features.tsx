'use client'

import { useState, useRef, useEffect } from 'react'
import { Transition } from '@headlessui/react'
import Image from 'next/image'

export default function Features() {
  
  const [tab, setTab] = useState<number>(1)

  const tabs = useRef<HTMLDivElement>(null)

  const heightFix = () => {
    if (tabs.current && tabs.current.parentElement) tabs.current.parentElement.style.height = `${tabs.current.clientHeight}px`
  }

  useEffect(() => {
    heightFix()
  }, []) 

  return (
    <section className="relative">
      {/* Section background (needs .relative class on parent and next sibling elements) */}
      <div className="absolute inset-0 mb-16 bg-[#1B1B1B] pointer-events-none" aria-hidden="true"/>
      <div className="absolute left-0 right-0 w-px h-20 p-px m-auto transform -translate-y-1/2 bg-gray-200"/> {/* vertical line */}

      <div className="relative max-w-6xl px-4 mx-auto sm:px-6">
        <div className="pt-12 md:pt-20">
          {/* Section header */}
          <div className="max-w-3xl pb-12 mx-auto text-center md:pb-5">
            <h1 className="mb-3 h2">The Problem</h1>
            <p className="text-xl text-white">With hospital wait times getting longer and longer, it is vital for patients to get the care they need as soon as possible. <br/> It is also crucial to self-diagnose, especially if one is on the way to the hospital, so they can understand the severity of their situation.</p>
            <br/><br/><br/>
            <div className="absolute left-0 right-0 w-px h-20 p-px m-auto transform -translate-y-1/2 bg-gray-200"/> {/* vertical line */}
            <h2 className="h2"><br/>Our Solution</h2>
          </div>
        </div>
      </div>
          {/* Items */}
          <div style={{ maxWidth: '600px', marginTop: '0' }} className="grid items-start gap-6 mx-auto md:grid-cols-1 lg:grid-cols-2 md:max-w-2xl lg:max-w-none">
            {/* 1st item */}  
            <div className="relative flex flex-col items-center p-6 bg-white rounded shadow-xl">
              <h4 className="mb-1 text-xl font-bold text-[#141414] leading-snug tracking-tight">Wait Time Estimates</h4>
              <p className="text-center text-[#141414]"> Allows users to see predicted wait times of nearby hospitals in a 15 mile radius. 
                <br/>Data source:{' '}
                Centers for Medicare and Medicaid Services&nbsp;
                <u>
                  <a href="https://data.cms.gov/">
                  (CMS)
                  </a>
                </u>
              </p>
            </div>

            {/* 2nd item */}
            <div className="relative flex flex-col items-center p-6 bg-white rounded shadow-xl">
              <h4 className="mb-1 text-xl font-bold text-[#141414] leading-snug tracking-tight">Self-Diagnosis</h4>
              <p className="text-center text-[#141414]"> A machine learning model that can classify common diseases on the body. Users can upload or take an image and our AI model will diagnose them on the spot.</p>
            </div>
          </div>
          <br/>
    </section>
  )
}