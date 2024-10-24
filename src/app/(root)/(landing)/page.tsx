import CardSkeleton from "@/components/ui/card-skeleton";
import Hero from "./components/hero";
import DirectoryPage from "../directory/page";

export default function Homepage() {
  return (
    <>
      <div className="flex flex-col items-center ">
        <Hero />

        <h1 className="text-6xl font-bold translate-y-24 text-text-light">Our Features</h1>

        <DirectoryPage />

        <div className="h-[20vh]"></div>
      </div>
    </>
  );
}
