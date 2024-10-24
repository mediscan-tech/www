"use client";
import CardSkeleton from "@/components/ui/card-skeleton";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function DirectoryPage() {
  const router = useRouter();
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center pt-[88px]">
      <div className="grid h-full w-full max-w-7xl grid-cols-3 gap-8 p-4 py-8">
        <CardSkeleton className="h-full w-full p-4">
          <div></div>
        </CardSkeleton>
        <CardSkeleton className="h-full w-full p-4 px-5">
          <div></div>
        </CardSkeleton>
        <button onClick={() => router.push("/telemedicine")}>
          <CardSkeleton className="relative flex h-full w-full flex-col items-center justify-center overflow-clip bg-bg">
            <Image
              src="/images/telemedicine.png"
              alt=""
              height="10000"
              width="10000"
              className="absolute h-full w-full translate-x-[5%] scale-110 object-contain opacity-60"
            ></Image>
            <h1 className="z-20 flex items-center justify-center p-4 text-4xl text-[3.35vw] font-extrabold">
              Telemedicine
            </h1>
            <p className="z-20 w-full px-8 text-center text-sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
              lobortis augue vel massa pellentesque, a sodales ipsum rhoncus.{" "}
            </p>
          </CardSkeleton>
        </button>
      </div>
    </div>
  );
}
