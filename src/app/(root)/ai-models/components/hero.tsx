"use client";
import CardSkeleton from "@/components/ui/card-skeleton";
import Spline from "@splinetool/react-spline";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FaLongArrowAltRight } from "react-icons/fa";

export default function AIModelsHero() {
  const router = useRouter();
  return (
    <div className="relative flex h-screen w-screen flex-col items-center justify-center">
      <div className="pointer-events-none relative flex aspect-square h-[100vh] w-[200vh] items-center justify-center overflow-clip">
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            ease: "easeInOut",
            duration: 2,
            delay: 0,
          }}
          className="absolute h-[100vh] w-[100vw] scale-125"
        >
          <Spline scene="https://prod.spline.design/z1gEIeKXgTijNQTE/scene.splinecode" />
        </motion.div>
      </div>
      <div className="absolute flex h-screen w-screen flex-col items-center justify-center">
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
          Self-diagnose in <br /> seconds.
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
          className="max-w-lg pt-8 text-center text-lg font-medium leading-6  text-text-light/80 drop-shadow-xl"
        >
          Powerful AI Models that can detect disesaes along with an AI powered
          chatbot
        </motion.h2>
      </div>
      <motion.div
        initial={{
          y: "32px",
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
        className="absolute bottom-16 flex w-full items-center justify-center space-x-4"
      >
        <button onClick={() => router.push("/ai-models/self-diagnose")}>
          <CardSkeleton className="flex w-48 items-center justify-center space-x-1 whitespace-nowrap rounded-lg px-6 py-2 font-semibold text-text">
            Self-Diagnose
          </CardSkeleton>
        </button>
        <button onClick={() => router.push("/diagnosis")}>
          <CardSkeleton className="flex w-48 items-center justify-center space-x-1 whitespace-nowrap rounded-lg px-6 py-2 font-semibold text-text">
            AI-Assistant
          </CardSkeleton>
        </button>
      </motion.div>
    </div>
  );
}
