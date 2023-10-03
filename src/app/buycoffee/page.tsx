"use client";

import { useAddress, useContract, useContractRead, Web3Button } from "@thirdweb-dev/react";
import HeroCard from "components/HeroCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "components/ui/Card";
import { SpinnerRoundFilled } from "spinners-react";
import { BUY_COFFEE_CONTRACT } from "@/constants";
import { useToast } from "components/ui/useToast";
import { ethers } from "ethers";
import FramerAnimate from "components/FramerAnimate";

const BuyCoffeePage = () => {
  const address = useAddress();
  const { contract, isLoading: contractIsLoading } = useContract(BUY_COFFEE_CONTRACT);
  const { data: totalTips, isLoading: totalTipsIsLoading } = useContractRead(
    contract,
    "getBalance"
  );
  const { data: owner, isLoading: ownerIsLoading } = useContractRead(contract, "owner");

  const isLoading = contractIsLoading || totalTipsIsLoading || ownerIsLoading;

  const { toast } = useToast();

  return (
    <FramerAnimate>
      <main className="container py-sm md:py-md">
        <HeroCard
          title="Buy Me a Coffee"
          description="Buy me a coffee by tipping me test Eth."
          imageUrl="/hot_cup_of_coffee.png"
          altText="Hot cup of coffee"
          isLoading={false}
        />

        {isLoading ? (
          <SpinnerRoundFilled color="#fff" className="mx-auto mt-10" />
        ) : (
          <div className="grid grid-cols-1 gap-4 pt-12 md:gap-8 sm:grid-cols-3">
            <Card className="h-full rounded">
              <CardHeader>
                <CardTitle>
                  <h3>Total Amount in Tip Jar</h3>
                </CardTitle>
                <CardDescription>
                  <p className="text-lg font-medium">
                    {ethers.utils.formatEther(totalTips).toLocaleString()} Eth
                  </p>
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="flex flex-col h-full rounded">
              <CardHeader>
                <CardTitle>
                  <h3>Buy Me a Coffee</h3>
                </CardTitle>
                <CardDescription>
                  <p className="text-lg font-medium">
                    {address ? "Send me Eth" : "Please connect your wallet"}
                  </p>
                </CardDescription>
              </CardHeader>
              {address && (
                <CardContent className="flex flex-col justify-end flex-1 text-center">
                  <Web3Button
                    style={{ width: "100%", transition: "all 0.2s ease-in-out" }}
                    className="hover:bg-slate-500 hover:text-white"
                    contractAddress={BUY_COFFEE_CONTRACT}
                    action={(contract) =>
                      contract.call("tipToBuyCoffee", [], {
                        value: ethers.utils.parseEther("0.001"),
                      })
                    }
                    onSuccess={() =>
                      toast({
                        title: "Successfully tipped 0.001 ETH!",
                      })
                    }
                    onError={() =>
                      toast({
                        title: "Error tipping 0.001 ETH",
                      })
                    }
                  >
                    Tip me 0.001 Eth
                  </Web3Button>
                </CardContent>
              )}
            </Card>

            <Card className="flex flex-col h-full rounded">
              <CardHeader>
                <CardTitle>
                  <h3>Withdraw tips</h3>
                </CardTitle>
                <CardDescription>
                  <p className="text-lg font-medium">
                    {address && address !== owner
                      ? "Only the contract owner can withdraw funds"
                      : address && address === owner
                      ? "Withdraw tips"
                      : "Please connect your wallet"}
                  </p>
                </CardDescription>
              </CardHeader>
              {address && address === owner && (
                <CardContent className="flex flex-col justify-end flex-1 text-center">
                  <Web3Button
                    style={{ width: "100%", transition: "all 0.2s ease-in-out" }}
                    className="hover:bg-slate-500 hover:text-white"
                    contractAddress={BUY_COFFEE_CONTRACT}
                    action={(contract) => contract.call("withdraw")}
                    onSuccess={() =>
                      toast({
                        title: "Successfully withdrew tips!",
                      })
                    }
                    onError={() =>
                      toast({
                        title: "Error withdrawing tips",
                      })
                    }
                  >
                    Withdraw
                  </Web3Button>
                </CardContent>
              )}
            </Card>
          </div>
        )}
      </main>
    </FramerAnimate>
  );
};

export default BuyCoffeePage;
