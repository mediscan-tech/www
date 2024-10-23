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
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
    icon: <GiHand className="h-full w-full" color="#14616e" />,
  },
  {
    href: "/oral",
    title: "Oral Wellness",
    description:
      "Dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
    icon: <RiToothFill className="h-full w-full" color="#14616e" />,
  },
  {
    href: "/hair",
    title: "Hair & Scalp Conditions",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
    icon: <MdFace className="h-full w-full" color="#14616e" />,
  },
  {
    href: "/diagnosis",
    title: "Diagnose By Symptom",
    description:
      "Dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
    icon: <FaCommentMedical className="h-full w-full" color="#14616e" />,
  },
  {
    href: "/diagnosis",
    title: "Tailored First-Aid Advice",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
    icon: <BsFillBandaidFill className="h-full w-full" color="#14616e" />,
  },
  {
    href: "/risk",
    title: "Health Risk Prediction",
    description:
      "Dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
    icon: <PiHeartbeatFill className="h-full w-full" color="#14616e" />,
  },
  {
    href: "/wait",
    title: "Hospital Wait Times",
    description:
      "Dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
    icon: <IoIosStopwatch className="h-full w-full" color="#14616e" />,
  },
  {
    href: "/telemedicine",
    title: "Telemedicine Service",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
    icon: <IoDesktop className="h-full w-full" color="#14616e" />,
  },
];

export default function DirectoryPage() {
  return (
    <div className="mb-32 flex h-full w-full items-center justify-center">
      <div className="flex h-full min-h-screen w-full items-center justify-center">
        <div className="grid w-full max-w-7xl grid-cols-4 gap-4 p-4 pt-[104px]">
          {elements.map((e, i) => (
            <motion.div
              key={i}
              initial={{
                y: "25%",
                opacity: 0,
              }}
              animate={{
                y: 0,
                opacity: 1,
              }}
              transition={{
                ease: "easeInOut",
                duration: 1,
                delay: i / 6,
              }}
            >
              <Link href={e.href}>
                <CardSkeleton className="flex aspect-square h-full flex-col p-4">
                  <div className="relative h-full">
                    <div className="absolute bottom-0 left-0 right-0 top-0 h-full w-full scale-75 justify-center opacity-50 blur-xl">
                      {e.icon ?? null}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 top-0 h-full w-full scale-75 justify-center">
                      {e.icon ?? null}
                    </div>
                  </div>
                  <div className="flex h-56 flex-col">
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
  );
}
