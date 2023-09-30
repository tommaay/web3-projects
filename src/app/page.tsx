"use client";

import { ConnectWallet, useAddress } from "@thirdweb-dev/react";

export default function Home() {
  const address = useAddress();
  console.log(address);

  return (
    <main className="container mx-auto max-w-screen-xl px-4">
      <h1 className="">Web3 Projects</h1>
      <ConnectWallet />
    </main>
  );
}
