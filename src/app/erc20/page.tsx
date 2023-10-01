"use client";

import {
  useAddress,
  useContract,
  useContractMetadata,
  useTokenSupply,
  useTokenBalance,
  Web3Button,
} from "@thirdweb-dev/react";
import HeroCard from "components/HeroCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "components/ui/Card";
import { SpinnerRoundFilled } from "spinners-react";
import { ERC20_CONTRACT } from "@/constants";
import Link from "next/link";

const Erc20Page = () => {
  const address = useAddress();
  const { contract, isLoading: contractIsLoading } = useContract(ERC20_CONTRACT);
  const { isLoading: metadataIsLoading } = useContractMetadata(contract);
  const { data: tokenSupply, isLoading: tokenSupplyIsLoading } = useTokenSupply(contract);
  const { data: tokenBalance, isLoading: tokenBalanceIsLoading } = useTokenBalance(
    contract,
    address
  );

  const isLoading =
    contractIsLoading || metadataIsLoading || tokenSupplyIsLoading || tokenBalanceIsLoading;

  return (
    <main className="container py-sm md:py-md">
      <HeroCard
        title="Tomster ERC20 Token"
        description="Tomster's test ERC20 token that can grant its owners super powers."
        imageUrl="/tomster.svg"
        altText="Tomster's ERC20 token"
        style={{ objectFit: "contain", background: "#fff" }}
        isLoading={contractIsLoading || metadataIsLoading}
      />

      {isLoading ? (
        <SpinnerRoundFilled color="#fff" className="mx-auto mt-10" />
      ) : (
        <div className="grid grid-cols-1 gap-8 pt-12 sm:grid-cols-3">
          <Card className="h-full rounded">
            <CardHeader>
              <CardTitle>
                <h2>Token stats</h2>
              </CardTitle>
              <CardDescription>
                <p className="text-lg font-medium">
                  Total supply:{" "}
                  <span className="whitespace-nowrap">
                    {Number(tokenSupply?.displayValue).toLocaleString()} {tokenSupply?.symbol}
                  </span>
                </p>
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="h-full rounded">
            <CardHeader className="flex flex-col justify-between h-full">
              <CardTitle>
                <h2>Your token balance</h2>
              </CardTitle>
              <div className="flex flex-col justify-between flex-1 gap-4">
                <CardDescription>
                  <p className="text-lg font-medium whitespace-nowrap">
                    {tokenBalance?.displayValue
                      ? Number(tokenBalance?.displayValue).toLocaleString()
                      : 0}{" "}
                    {tokenSupply?.symbol}
                  </p>
                </CardDescription>

                <Web3Button
                  contractAddress={ERC20_CONTRACT}
                  action={(contract) => contract.erc20.burn(25)}
                  className="transition-all ease-in-out hover:bg-slate-500 hover:text-white"
                >
                  Burn 25 tokens
                </Web3Button>
              </div>
            </CardHeader>
          </Card>
          <Card className="h-full rounded">
            <CardHeader>
              <CardTitle>
                <h2>Earn tokens</h2>
              </CardTitle>
              <CardDescription>
                <p className="text-lg font-medium">Earn TOM tokens by staking Cypher Chicks NFTs</p>
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-2">
              <div className="flex flex-col gap-4 lg:flex-row">
                <Link
                  href="/staking"
                  className="lg:flex-1 text-black bg-white rounded-[8px] h-11 flex items-center justify-center transition-all ease-in-out hover:bg-slate-500 hover:text-white"
                >
                  Stake
                </Link>
                <Link
                  href="/cypher-chicks"
                  className="lg:flex-1 text-black bg-white rounded-[8px] h-11 flex items-center transition-all ease-in-out hover:bg-slate-500 hover:text-white justify-center"
                >
                  Mint NFTs
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  );
};

export default Erc20Page;
