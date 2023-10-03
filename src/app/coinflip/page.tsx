"use client";

import { Web3Button, useAddress, useContract, useContractEvents } from "@thirdweb-dev/react";
import HeroCard from "components/HeroCard";
import { SpinnerRoundFilled } from "spinners-react";
import { COIN_FLIP_CONTRACT } from "@/constants";
import { useToast } from "components/ui/useToast";
import FramerAnimate from "components/FramerAnimate";

const COIN_FLIP: Record<string | number, string> = {
  0: "Heads",
  1: "Tails",
};

const FLIP_RESULT: Record<string | number, string> = {
  0: "Won!",
  1: "Lost!",
};

const CoinFlipPage = () => {
  const address = useAddress();
  const { contract } = useContract(COIN_FLIP_CONTRACT);
  const { data: events, isLoading: eventsIsLoading } = useContractEvents(contract);

  const { toast } = useToast();

  return (
    <FramerAnimate>
      <main className="container py-sm md:py-md">
        <HeroCard
          title="Lets play a game of heads or tails."
          description="The results of the coin flip are stored on the blockchain."
          imageUrl="/coins.png"
          altText="Golden coins"
          isLoading={false}
        />

        <div className="grid gap-6 mt-10 sm:grid-cols-2 md:gap-10">
          <div>
            <h2 className="mb-4 text-2xl sm:text-3xl">Select heads or tails</h2>
            <div className="flex gap-4 text-center">
              <Web3Button
                contractAddress={COIN_FLIP_CONTRACT}
                action={(contract) => contract.call("flipCoin", [0])}
                onSuccess={(result) => {
                  toast({
                    title: "Coin flipped",
                    description: "You chose Heads.",
                  });
                }}
                style={{ display: "block", transition: "all 0.2s ease-in-out", flexGrow: "1" }}
                className="hover:bg-slate-500 hover:text-white"
              >
                Heads
              </Web3Button>
              <Web3Button
                contractAddress={COIN_FLIP_CONTRACT}
                action={(contract) => contract.call("flipCoin", [1])}
                onSuccess={(result) => {
                  toast({
                    title: "Coin flipped",
                    description: "You chose Tails.",
                  });
                }}
                style={{ display: "block", transition: "all 0.2s ease-in-out", flexGrow: "1" }}
                className="hover:bg-slate-500 hover:text-white"
              >
                Tails
              </Web3Button>
            </div>
          </div>
          <div className="">
            <h2 className="mb-4 text-2xl sm:text-3xl">Past results</h2>
            {eventsIsLoading ? (
              <SpinnerRoundFilled color="#fff" className="mx-auto" />
            ) : (
              events?.map(({ data: { player, side, result }, transaction: { blockHash } }) => {
                const playerDisplay =
                  address === player
                    ? "You"
                    : `${player.slice(0, 6)}...${player.slice(player.length - 6)}`;
                return (
                  <p className="mb-2 text-lg" key={blockHash}>
                    {playerDisplay} chose{" "}
                    <span className={!!side ? "text-blue-400" : "text-orange-400"}>
                      {COIN_FLIP[side]}
                    </span>{" "}
                    and{" "}
                    <span className={!!side ? "text-green-500" : "text-red-500"}>
                      {FLIP_RESULT[result]}
                    </span>
                  </p>
                );
              })
            )}
          </div>
        </div>
      </main>
    </FramerAnimate>
  );
};

export default CoinFlipPage;
