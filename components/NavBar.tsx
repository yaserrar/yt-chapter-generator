import Link from "next/link";
import DarkModeButton from "./DarkModeButton";
import { Github, Linkedin } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";

const NavBar = () => {
  return (
    <main className="border-b-2">
      <nav className="flex justify-between p-4 container max-w-7xl text-sm items-center">
        <Link href="/" className="font-bold text-base">
          Chapter Generator
        </Link>
        <section className="flex gap-3 items-center">
          <Link
            href="https://github.com/yaserrar"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "flex gap-2 items-center font-semibold"
            )}
          >
            <Github size={16} /> Github
          </Link>
          <Link
            href="https://www.linkedin.com/in/youssefaserrar/"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "flex gap-2 items-center font-semibold"
            )}
          >
            <Linkedin size={16} /> LinkedIn
          </Link>
          <DarkModeButton />
        </section>
      </nav>
    </main>
  );
};

export default NavBar;
