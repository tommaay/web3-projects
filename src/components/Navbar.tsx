"use client";

import Image from "next/image";
import Link from "next/link";
import { ConnectWallet } from "@thirdweb-dev/react";

function Navbar() {
  return (
    <nav className="container flex items-center justify-between py-sm">
      <Link href="/">
        <Image
          src="logo-square.svg"
          alt="Tomster logo"
          width={60}
          height={60}
          className="hover:shadow-lg hover:shadow-white/10"
        />
      </Link>
      <ConnectWallet />
    </nav>
  );
}

export default Navbar;
