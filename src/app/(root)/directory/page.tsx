"use client";
import CardSkeleton from "@/components/ui/card-skeleton";
import Image from "next/image"
import { useRouter } from "next/navigation";

export default function DirectoryPage() {
  const router = useRouter();
  return (
    <div className="h-screen w-full pt-[88px] flex flex-col items-center justify-center">
      <div className="grid gap-8 grid-cols-3 w-full max-w-7xl h-full p-4 py-8">
        <CardSkeleton className="h-full w-full p-4">
          <div></div>
        </CardSkeleton>
        <CardSkeleton className="h-full w-full p-4 px-5">
          <div></div>
        </CardSkeleton>
        <button onClick={() => router.push("/telemedicine")}>
          <CardSkeleton className="h-full w-full bg-bg overflow-clip flex flex-col relative items-center justify-center">
            <Image src="/images/telemedicine.png" alt="" height="10000" width="10000" className="opacity-60 absolute w-full h-full object-contain translate-x-[5%] scale-110"></Image>
            <h1 className="p-4 text-4xl font-extrabold text-[3.35vw] flex items-center justify-center z-20">
              Telemedicine
            </h1>
            <p className="text-sm w-full px-8 z-20 text-center">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lobortis augue vel massa pellentesque, a sodales ipsum rhoncus. </p>
          </CardSkeleton>
        </button>
      </div>
    </div>
  );
}
