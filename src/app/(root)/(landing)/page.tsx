import CardSkeleton from "@/components/ui/card-skeleton";
import Hero from "./components/hero";
import DirectoryPage from "../directory/page";

export default function Homepage() {
  return (
    <>
      <div className="flex flex-col items-center ">
        <Hero />

        <h1 className="mt-24 translate-y-20 text-6xl font-bold text-text-light">
          Our Features
        </h1>
        <div className="flex h-0.5 w-[90vw] translate-y-24">
          <div className="w-full bg-gradient-to-r from-bg to-text-light/40"></div>
          <div className="w-full bg-gradient-to-l from-bg to-text-light/40"></div>
        </div>

        <div id="about">
          <DirectoryPage />
        </div>

        <div className="h-[20vh]"></div>
      </div>
    </>
  );
}
