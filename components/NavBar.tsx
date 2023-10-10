import Link from "next/link";

const NavBar = () => {
  return (
    <main className="border-b-2">
      <nav className="flex justify-between p-4 container max-w-7xl text-sm">
        <div>
          <Link href="/" className="font-bold">
            Chapter Generator
          </Link>
        </div>
        <section className="flex gap-2">
          <Link href="#">Home</Link>
          <Link href="#">Home</Link>
          <Link href="#">Home</Link>
          <Link href="#">Home</Link>
        </section>
      </nav>
    </main>
  );
};

export default NavBar;
