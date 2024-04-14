import Image from "next/image";
import Link from "next/link";
import logobg from "../lib/assets/logobg.png";
import { Button } from "./ui/button";

export default async function Navbar() {
  return (
    <header className="fixed w-full p-0 md:p-2 flex justify-between items-center md:bg-transparent">
      <div className="p-2">
        <Link href="/" style={{ cursor: "pointer" }}>
          <Image
            src={logobg}
            alt="Cloudflare Logo"
            className="w-6 h-6 sm:h-8 sm:w-8"
          />
          <span className="sr-only">Di1</span>
        </Link>
      </div>
      <div className="p-2">
        <Button
          size={"sm"}
          variant={"ghost"}
          className="text-muted-foreground dark:text-black hover:bg-white/25 focus:bg-white/25 hover:text-white/80"
          asChild
        >
          <Link href="/about">About</Link>
        </Button>
      </div>
    </header>
  );
}
