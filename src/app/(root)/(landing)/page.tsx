import CardSkeleton from "@/components/ui/card-skeleton";
import Hero from "./components/hero";
import DirectoryPage from "../directory/page";

export default function Homepage() {
  return (
    <>
      <div className="flex flex-col items-center ">
        <Hero />

        <h1 className="text-6xl font-bold translate-y-20 mt-24 text-text-light">Our Features</h1>
        <div className="w-[90vw] translate-y-24 h-0.5 flex">
          <div className="bg-gradient-to-r from-bg to-text-light/40 w-full"></div>
          <div className="bg-gradient-to-l from-bg to-text-light/40 w-full"></div>
        </div>

        <DirectoryPage />

        <div className="h-[20vh]"></div>
      </div>
    </>
  );
}
