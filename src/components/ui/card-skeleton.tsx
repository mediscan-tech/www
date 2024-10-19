import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export default function CardSkeleton(props: { round?: boolean, className?: string, children: ReactNode }) {
  return (
    <div className={cn(`relative h-full w-full border-[1px] border-bg-extralight bg-bg-light/50 ${props.round == true ? "rounded-full" : "rounded-2xl"}`, props.className)}>
      <div className={`select-none pointer-events-none absolute top-0 right-0 left-0 bottom-0 w-full h-full border-2 border-neutral-700 blur-[8px] z-30 ${props.round == true ? "rounded-full" : "rounded-2xl"}`}></div>
      {props.children}
    </div>
  )
}