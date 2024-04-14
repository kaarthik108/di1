import Link from "next/link";
import React from "react";
import { IconGitHub, IconX } from "./ui/icons";

export default async function Footer() {
  return (
    <footer className="w-full p-3 md:p-4 fixed bottom-0 right-0 left-0 flex justify-center bg-[#2b2b27]">
      <div className="flex items-center gap-4">
        <Link href="https://github.com/kaarthik108/di1" target="_blank">
          <IconGitHub className="hover:text-white" />
        </Link>

        <Link
          href="https://twitter.com/kaarthikcodes"
          target="_blank"
          className="hover:text-white"
        >
          <IconX className="hover:text-white text-black" />
        </Link>
      </div>
    </footer>
  );
}
