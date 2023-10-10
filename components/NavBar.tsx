import Link from "next/link";
import DarkModeButton from "./DarkModeButton";

const NavBar = () => {
  return (
    <main className="border-b-2">
      <nav className="flex justify-between p-4 container max-w-7xl text-sm items-center">
        <Link href="/" className="font-bold">
          Chapter Generator
        </Link>
        <section className="flex gap-2 items-center">
          <Link href="#">Home</Link>
          <DarkModeButton />
        </section>
      </nav>
    </main>
  );
};

export default NavBar;
