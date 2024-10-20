"use client";
import CardSkeleton from "@/components/ui/card-skeleton";
import { motion } from "framer-motion";
import Link from "next/link";

const elements: DirectoryElement[] = [
  {
    href: "/skin",
    title: "Self-Diagnose Skin Disease",
    description: "Upload an image of your skin, and recieve an accurate prediction in seconds!"
  },
  {
    href: "/mouth",
    title: "Self-Diagnose Mouth Disease",
    description: "Upload an image of your mouth, and recieve an accurate prediction in seconds!"
  },
  {
    href: "/skin",
    title: "Self-Diagnose Skin Disease",
    description: "Upload an image of your skin, and recieve an accurate prediction in seconds!"
  },
  {
    href: "/skin",
    title: "Self-Diagnose Skin Disease",
    description: "Upload an image of your skin, and recieve an accurate prediction in seconds!"
  },
  {
    href: "/skin",
    title: "Self-Diagnose Skin Disease",
    description: "Upload an image of your skin, and recieve an accurate prediction in seconds!"
  },
  {
    href: "/skin",
    title: "Self-Diagnose Skin Disease",
    description: "Upload an image of your skin, and recieve an accurate prediction in seconds!"
  },
  {
    href: "/skin",
    title: "Self-Diagnose Skin Disease",
    description: "Upload an image of your skin, and recieve an accurate prediction in seconds!"
  },
  {
    href: "/skin",
    title: "Self-Diagnose Skin Disease",
    description: "Upload an image of your skin, and recieve an accurate prediction in seconds!"
  },
]

export default function DirectoryPage() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-full h-full min-h-screen flex items-center justify-center">
        <div className="pt-[104px] grid grid-cols-4 w-full max-w-7xl p-4 gap-4">
          {elements.map((e, i) => (
            <motion.div
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
                delay: i / 6
              }}
            >
              <Link href={e.href}>
                <CardSkeleton className="aspect-square p-4">
                  <h1 className="text-text-light text-xl font-medium">{e.title}</h1>
                  <p className="mt-2 text-sm">{e.description}</p>
                </CardSkeleton>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}