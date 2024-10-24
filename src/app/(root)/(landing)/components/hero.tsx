"use client";
import Spline from "@splinetool/react-spline";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <div className="relative flex items-center justify-center w-screen h-screen">
      <div className="pointer-events-none relative flex aspect-square h-[100vh] w-[200vh] items-center justify-center overflow-clip">
        <div className="absolute h-[100vh] w-[100vw] scale-150">
          <Spline scene="/spline/hero.splinecode" />
        </div>
      </div>
      <div className="absolute flex flex-col items-center justify-center w-screen h-screen">
        <motion.h1
          initial={{
            y: "50%",
            opacity: 0,
          }}
          animate={{
            y: 0,
            opacity: 1,
          }}
          transition={{
            ease: "easeInOut",
            duration: 2,
            delay: 1,
          }}
          className="flex max-w-3xl items-center justify-center bg-gradient-to-br from-text-light from-50% to-primary bg-clip-text text-center text-6xl font-bold leading-[72px] text-transparent drop-shadow-xl"
        >
          Healthcare at your fingertips.
        </motion.h1>
        <motion.h2
          initial={{
            y: "50%",
            opacity: 0,
          }}
          animate={{
            y: 0,
            opacity: 1,
          }}
          transition={{
            ease: "easeInOut",
            duration: 1,
            delay: 2,
          }}
          className="max-w-xl pt-8 text-lg font-medium leading-6 text-center text-text-light/80 drop-shadow-xl"
        >
          Easily self-diagnose with our AI-powered chatbot and disease detection models, setup video conferences with doctors, and get updated and accurate wait times of hospitals in your area.
        </motion.h2>
      </div>
    </div>
  );
}
