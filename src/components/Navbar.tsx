"use client";

import Image from "next/image";
import { ConnectWallet } from "@thirdweb-dev/react";

function Navbar() {
  return (
    <nav className="container flex items-center justify-between py-sm">
      <Image src="logo-square.svg" alt="Tomster logo" width={60} height={60} />
      <ConnectWallet />
    </nav>
  );
}

export default Navbar;
