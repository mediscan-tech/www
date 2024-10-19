"use client";
import Spline from "@splinetool/react-spline";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <div className="w-screen h-screen flex items-center justify-center relative">
      <div className="relative aspect-square h-[100vh] w-[100vh] overflow-clip flex items-center justify-center pointer-events-none">
        <div className="w-[100vw] h-[100vh] absolute scale-150">
          <Spline
            scene="/spline/hero.splinecode"
          />
        </div>
      </div>
      <div className="absolute w-screen h-screen flex flex-col items-center justify-center">
        <motion.h1
          initial={{
            y: "50%",
            opacity: 0,
          }}
          animate={{
            y: 0,
            opacity: 1
          }}
          transition={{
            ease: "easeInOut",
            duration: 2,
            delay: 1
          }}
          className="text-6xl font-bold text-center flex items-center justify-center max-w-3xl bg-gradient-to-br from-text-light from-50% to-primary text-transparent bg-clip-text drop-shadow-xl leading-[72px]">Healthcare at your fingertips.</motion.h1>
        <motion.h2
          initial={{
            y: "50%",
            opacity: 0,
          }}
          animate={{
            y: 0,
            opacity: 1
          }}
          transition={{
            ease: "easeInOut",
            duration: 1,
            delay: 2
          }}
          className=" text-lg font-medium text-center max-w-lg pt-8 drop-shadow-xl leading-6 text-text-light/80">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer id posuere neque. Nulla non aliquet tellus.</motion.h2>
      </div>
    </div>
  )
}