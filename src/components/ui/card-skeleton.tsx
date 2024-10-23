import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export default function CardSkeleton(props: {
  round?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        `relative border-[1px] border-bg-extralight bg-bg-light/50 ${
          props.round == true ? "rounded-full" : "rounded-2xl"
        }`,
        props.className
      )}
    >
      <div
        className={`pointer-events-none absolute bottom-0 left-0 right-0 top-0 z-30 h-full w-full select-none border-2 border-neutral-700 blur-[8px] ${
          props.round == true ? "rounded-full" : "rounded-2xl"
        }`}
      ></div>
      {props.children}
    </div>
  );
}
