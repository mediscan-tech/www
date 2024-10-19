import CardSkeleton from "@/components/ui/card-skeleton";
import Hero from "./components/hero";

export default function Homepage() {
  return (
    <>
      <div className="flex flex-col items-center ">
        <Hero />

        {/* <div className="h-[80vh] w-full max-w-7xl mt-32 grid grid-cols-3 grid-rows-2">
          <CardSkeleton className="w-full h-full" children={""} />
        </div> */}

        <div className="h-screen"></div>
      </div>
    </>
  )
}
