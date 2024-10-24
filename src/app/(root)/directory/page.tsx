"use client";
import CardSkeleton from "@/components/ui/card-skeleton";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function DirectoryPage() {
  const router = useRouter();
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center pt-[88px]">
      <div className="grid h-full w-full max-w-7xl grid-cols-3 gap-8 p-4 py-8">

        <button onClick={() => router.push("/map")}>
          <CardSkeleton className="relative flex h-full w-full flex-col items-center justify-center overflow-clip bg-bg">
            <Image
              src="/images/circle.png"
              alt=""
              height="10000"
              width="10000"
              className="absolute h-full w-full translate-x-[5%] scale-150 object-contain opacity-90"
            ></Image>
            <h1 className="z-20 flex items-center justify-center p-4 text-5xl font-extrabold">
              Wait Times
            </h1>
            <p className="z-20 w-full px-8 text-center text-sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
              lobortis augue vel massa pellentesque, a sodales ipsum rhoncus.{" "}
            </p>
          </CardSkeleton>
        </button>
        <button onClick={() => router.push("/ai-models/")}>
          <CardSkeleton className="relative flex h-full w-full flex-col items-center justify-center overflow-clip bg-bg">
            <Image
              src="/images/ai-models.png"
              alt=""
              height="10000"
              width="10000"
              className="absolute h-full w-full  scale-110 object-contain opacity-50"
            ></Image>
            <h1 className="z-20 flex items-center justify-center p-4 text-5xl font-extrabold">
              Self-Diagnose
            </h1>
            <p className="z-20 w-full px-8 text-center text-sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
              lobortis augue vel massa pellentesque, a sodales ipsum rhoncus.{" "}
            </p>
          </CardSkeleton>
        </button>
        <button onClick={() => router.push("/telemedicine")}>
          <CardSkeleton className="relative flex h-full w-full flex-col items-center justify-center overflow-clip bg-bg">
            <Image
              src="/images/telemedicine.png"
              alt=""
              height="10000"
              width="10000"
              className="absolute h-full w-full translate-x-[5%] scale-110 object-contain opacity-70"
            ></Image>
            <h1 className="z-20 flex items-center justify-center p-4 text-5xl font-extrabold">
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
