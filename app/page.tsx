import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-wrap h-[90vh] items-center">
      <div className="w-full md:w-1/2">
        <h1 className="text-5xl font-bold mb-2">
          Generate YouTube Chapters in Seconds
        </h1>
        <h3 className="text-lg">
          {"We'll"} use AI to download your video transcripts and turn them into
          timestamps.
        </h3>
        <Link className={cn(buttonVariants(), "mt-4")} href="/generate">
          Get started
        </Link>
      </div>
      <div className="w-full md:w-1/2 hidden md:flex justify-center">
        <Image
          src="/home.png"
          alt="home image"
          height={500}
          width={500}
          quality={100}
        />
      </div>
    </main>
  );
}
