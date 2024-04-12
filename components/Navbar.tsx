import Image from "next/image";
import Link from "next/link";
import logobg from "../lib/assets/logobg.png";

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
    </header>
  );
}
