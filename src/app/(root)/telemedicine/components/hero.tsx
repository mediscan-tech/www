"use client";
import CardSkeleton from "@/components/ui/card-skeleton";
import Spline from "@splinetool/react-spline";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FaLongArrowAltRight } from "react-icons/fa";

export default function TelemedicineHero() {
  const router = useRouter();
  return (
    <div className="relative flex h-screen w-screen flex-col items-center justify-center">
      <div className="pointer-events-none relative flex aspect-square h-[100vh] w-[200vh] items-center justify-center overflow-clip opacity-70">
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
            delay: 1,
          }}
          className="absolute h-[100vh] w-[100vw] scale-150"
        >
          <Spline scene="/spline/telemedicine.splinecode" />
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
          Healthcare from the comfort of your home.
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
          className=" max-w-lg pt-8 text-center text-lg font-medium leading-6 text-text-light/80 drop-shadow-xl"
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer id
          posuere neque. Nulla non aliquet tellus.
        </motion.h2>
      </div>
      <motion.button
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
        className="relative h-12 w-48"
        onClick={() => router.push("/schedule")}
      >
        <CardSkeleton className="absolute bottom-16 mt-6 flex items-center justify-center space-x-1 whitespace-nowrap rounded-lg px-6 py-2 pr-4 font-semibold text-text">
          Start Connecting <FaLongArrowAltRight className="h-4 w-4" />
        </CardSkeleton>
      </motion.button>
    </div>
  );
}
