"use client";
import { GiHand } from "react-icons/gi";
import { RiToothFill } from "react-icons/ri";
import { MdFace } from "react-icons/md";
import { FaCommentMedical } from "react-icons/fa";
import { BsFillBandaidFill } from "react-icons/bs";
import { PiHeartbeatFill } from "react-icons/pi";
import { IoIosStopwatch } from "react-icons/io";
import { IoDesktop } from "react-icons/io5";
import CardSkeleton from "@/components/ui/card-skeleton";
import { DirectoryElement } from "@/lib/types";
import { motion } from "framer-motion";
import Link from "next/link";

const elements: DirectoryElement[] = [
  {
    href: "/skin",
    title: "Skin Conditions & Disease",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
    icon: <GiHand className="w-full h-full" color="#14616e" />
  },
  {
    href: "/oral",
    title: "Oral Wellness",
    description: "Dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
    icon: <RiToothFill className="w-full h-full" color="#14616e" />
  },
  {
    href: "/hair",
    title: "Hair & Scalp Conditions",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
    icon: <MdFace className="w-full h-full" color="#14616e" />
  },
  {
    href: "/symptom",
    title: "Diagnose By Symptom",
    description: "Dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
    icon: <FaCommentMedical className="w-full h-full" color="#14616e" />
  },
  {
    href: "/first-aid",
    title: "Tailored First-Aid Advice",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
    icon: <BsFillBandaidFill className="w-full h-full" color="#14616e" />
  },
  {
    href: "/risk",
    title: "Health Risk Prediction",
    description: "Dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
    icon: <PiHeartbeatFill className="w-full h-full" color="#14616e" />
  },
  {
    href: "/wait",
    title: "Hospital Wait Times",
    description: "Dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
    icon: <IoIosStopwatch className="w-full h-full" color="#14616e" />
  },
  {
    href: "/telemedicine",
    title: "Telemedicine Service",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
    icon: <IoDesktop className="w-full h-full" color="#14616e" />
  },
]

export default function DirectoryPage() {
  return (
    <div className="w-full h-full flex items-center justify-center mb-32">
      <div className="w-full h-full min-h-screen flex items-center justify-center">
        <div className="pt-[104px] grid grid-cols-4 w-full max-w-7xl p-4 gap-4">
          {elements.map((e, i) => (
            <motion.div
              initial={{
                y: "25%",
                opacity: 0,
              }}
              animate={{
                y: 0,
                opacity: 1
              }}
              transition={{
                ease: "easeInOut",
                duration: 1,
                delay: i / 6
              }}
            >
              <Link href={e.href}>
                <CardSkeleton className="aspect-square h-full p-4 flex flex-col">
                  <div className="h-full relative">
                    <div className="absolute justify-center top-0 left-0 right-0 bottom-0 w-full h-full blur-xl opacity-50 scale-75">
                      {e.icon ?? null}
                    </div>
                    <div className="absolute justify-center top-0 left-0 right-0 bottom-0 w-full h-full scale-75">
                      {e.icon ?? null}
                    </div>
                  </div>
                  <div className="flex flex-col h-56">
                    <h1 className="pt-4">{e.title}</h1>
                    <p className="mt-2">{e.description}</p>
                  </div>
                </CardSkeleton>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}