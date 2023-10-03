"use client";

import { useEffect, useMemo, useState } from "react";
import {
  useAddress,
  useContract,
  useTokenSupply,
  useNFTs,
  Web3Button,
  useOwnedNFTs,
  useTotalCount,
  useClaimedNFTSupply,
  useContractRead,
  ThirdwebNftMedia,
  NFT,
} from "@thirdweb-dev/react";
import HeroCard from "components/HeroCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "components/ui/Card";
import { SpinnerRoundFilled } from "spinners-react";
import { STAKING_CONTRACT, ERC721A_CONTRACT, ERC20_CONTRACT } from "@/constants";
import Link from "next/link";
import FramerAnimate from "components/FramerAnimate";
import { useToast } from "components/ui/useToast";
import { ethers } from "ethers";

const StakingPage = () => {
  const address = useAddress();

  // Staking contract hooks
  const { contract: stakingContract, isLoading: stakingContractIsLoading } =
    useContract(STAKING_CONTRACT);
  const { data: stakingContractTokenBalance, isLoading: stakingContractTokenBalanceIsLoading } =
    useContractRead(stakingContract, "getRewardTokenBalance");
  const { data: stakeInfo } = useContractRead(stakingContract, "getStakeInfo", [address]);

  // NFT hooks
  const { contract: nftsContract, isLoading: nftsContractIsLoading } = useContract(
    ERC721A_CONTRACT,
    "signature-drop"
  );
  const { data: nfts, isLoading: nftsIsLoading } = useNFTs(nftsContract);
  const { data: totalNftsSupply, isLoading: totalNftsSupplyIsLoading } =
    useTotalCount(nftsContract);
  const { data: totalNftsClaimed, isLoading: totalNftsClaimedIsLoading } =
    useClaimedNFTSupply(nftsContract);
  const { data: ownedNfts } = useOwnedNFTs(nftsContract, address);

  // ERC20 hooks
  const { contract: erc20Contract, isLoading: erc20ContractIsLoading } =
    useContract(ERC20_CONTRACT);
  const { data: erc20TokenSupply, isLoading: erc20TokenSupplyIsLoading } =
    useTokenSupply(erc20Contract);

  const { toast } = useToast();

  const isLoading =
    stakingContractIsLoading ||
    stakingContractTokenBalanceIsLoading ||
    nftsContractIsLoading ||
    nftsIsLoading ||
    totalNftsSupplyIsLoading ||
    totalNftsClaimedIsLoading ||
    erc20ContractIsLoading ||
    erc20TokenSupplyIsLoading;

  const rewards = stakeInfo?.[1] || 0;
  const stakeRewards = Number(rewards);
  const stakedNfts = useMemo(() => stakeInfo?.[0] || [], [stakeInfo]);

  const [userStakedNfts, setUserStakedNfts] = useState([]);

  useEffect(() => {
    if (!stakedNfts?.length || !nfts?.length) return;

    const userStakedNfts = stakedNfts.map((tokenId: BigInt) => {
      return nfts?.find((nft) => nft.metadata.id === tokenId.toString()) || [];
    });

    setUserStakedNfts(userStakedNfts);
  }, [nfts, stakedNfts]);

  const onStakeNft = async (tokenId: string) => {
    const isApproved = await nftsContract?.isApproved(address!, STAKING_CONTRACT);

    if (!isApproved) {
      try {
        const tx = await nftsContract?.call("setApprovalForAll", [STAKING_CONTRACT, true]);
        toast({
          title: "Approval successful",
          description: `Transaction hash: ${tx?.hash}`,
        });
      } catch (e) {
        toast({
          title: "Approval failed",
          description: "Something went wrong with the approval transaction",
        });
      }
    } else {
      try {
        const tx = await stakingContract?.call("stake", [[tokenId]]);
        toast({
          title: "Stake successful",
          description: `Transaction hash: ${tx.hash}`,
        });
      } catch (e) {
        toast({
          title: "Stake failed",
          description: "Something went wrong with the staking transaction",
        });
      }
    }
  };

  const onUnstakeNft = async (tokenId: string) => {
    try {
      const tx = await stakingContract?.call("withdraw", [[tokenId]]);
      toast({
        title: "Unstake successful",
        description: `Transaction hash: ${tx.hash}`,
      });
    } catch (e) {
      toast({
        title: "Unstake failed",
        description: "Something went wrong with the unstaking transaction",
      });
    }
  };

  return (
    <FramerAnimate>
      <main className="container py-sm md:py-md">
        <HeroCard
          title="Stake Cypher Chicks NFTs."
          description="Stake Cypher Chicks NFTs to earn TOMS tokens."
          imageUrl="/cypherpunk_anime_girl_3.png"
          altText="Cypher Chicks NFT"
          style={{ objectFit: "contain", background: "#fff" }}
          isLoading={false}
        />

        {isLoading ? (
          <SpinnerRoundFilled color="#fff" className="mx-auto mt-10" />
        ) : (
          <div className="grid grid-cols-1 gap-4 pt-12 md:gap-8 md:grid-cols-3">
            <Card className="h-full rounded">
              <CardHeader>
                <CardTitle>NFT info</CardTitle>
                <CardDescription className="flex flex-col gap-1">
                  <p className="text-lg font-medium">
                    Cypher Chicks Supply:{" "}
                    <span className="whitespace-nowrap">{Number(totalNftsSupply) || 0}</span>
                  </p>
                  <p className="text-lg font-medium">
                    Cypher Chicks Minted:{" "}
                    <span className="whitespace-nowrap">{Number(totalNftsClaimed) || 0}</span>
                  </p>
                  {!!address && !isLoading && (
                    <p className="text-lg font-medium">
                      Your Cypher Chicks Owned:{" "}
                      <span className="whitespace-nowrap">{ownedNfts?.length || 0}</span>
                    </p>
                  )}
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="flex flex-col h-full rounded">
              <CardHeader>
                <CardTitle>
                  <h3>Your rewards</h3>
                </CardTitle>
                {!address && !isLoading ? (
                  <CardDescription>
                    <p className="text-lg font-medium">
                      Please connect your wallet to check your rewards
                    </p>
                  </CardDescription>
                ) : (
                  <CardDescription className="flex flex-col gap-1">
                    <p className="text-lg font-medium">
                      Total supply:{" "}
                      <span className="whitespace-nowrap">
                        {Number(erc20TokenSupply?.displayValue).toLocaleString()}{" "}
                        {erc20TokenSupply?.symbol}
                      </span>
                    </p>
                    <p className="text-lg font-medium">
                      Rewards supply:{" "}
                      <span className="whitespace-nowrap">
                        {Number(
                          ethers.utils.formatEther(stakingContractTokenBalance)
                        ).toLocaleString()}{" "}
                        {erc20TokenSupply?.symbol}
                      </span>
                    </p>
                    <p className="text-lg font-medium whitespace-nowrap">
                      Earned: {ethers.utils.formatEther(rewards)} {erc20TokenSupply?.symbol}
                    </p>
                  </CardDescription>
                )}
              </CardHeader>

              <CardContent className="flex flex-col justify-end flex-1">
                <Web3Button
                  style={{ width: "100%", transition: "all 0.2s ease-in-out" }}
                  className="hover:bg-slate-500 hover:text-white"
                  contractAddress={STAKING_CONTRACT}
                  action={(contract) => contract.call("claimRewards")}
                  isDisabled={stakeRewards === 0 || isLoading}
                  onSuccess={() => {
                    toast({
                      title: "Claim successful",
                      description: `You have claimed ${stakeRewards} TOMS tokens`,
                    });
                  }}
                  onError={() =>
                    toast({
                      title: "Claim failed",
                      description: "Something went wrong with the claim transaction",
                    })
                  }
                >
                  Claim rewards
                </Web3Button>
              </CardContent>
            </Card>

            <Card className="flex flex-col h-full rounded">
              <CardHeader>
                <CardTitle>
                  <h3>Staked NFTs</h3>
                </CardTitle>
                <CardDescription>
                  <p className="text-lg font-medium">
                    {!!ownedNfts?.length ? (
                      <p className="text-lg font-medium">{stakedNfts?.length} NFTs Staked</p>
                    ) : (
                      "Go mint a Cypher Chicks NFT to stake and start earning TOMS tokens"
                    )}
                  </p>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col justify-end flex-1 gap-2">
                {!ownedNfts?.length && (
                  <Link
                    href="/cypher-chicks"
                    className="text-black bg-white rounded-[8px] h-11 flex items-center justify-center transition-all ease-in-out hover:bg-slate-500 hover:text-white"
                  >
                    Mint NFT &rarr;
                  </Link>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid gap-16 mt-10 md:grid-cols-2">
          {!!userStakedNfts?.length && (
            <Card className="rounded">
              <CardHeader>
                <CardTitle>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl">Your Staked NFTs</h3>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-6 justify-items-center lg:grid-cols-2">
                  {userStakedNfts.map((nft: NFT) => {
                    return (
                      <div key={nft.metadata.id}>
                        <Card className="h-full max-w-xs overflow-hidden rounded bg-zinc-900/20">
                          <div className="relative flex items-center justify-center h-48 md:h-64">
                            <ThirdwebNftMedia
                              metadata={nft.metadata}
                              width="100%"
                              height="100%"
                              style={{
                                objectFit: "cover",
                                objectPosition: "center",
                              }}
                            />
                          </div>
                          {!nftsContractIsLoading && (
                            <>
                              <CardHeader>
                                <CardTitle>{nft.metadata.name}</CardTitle>
                                <CardDescription>{nft.metadata.description}</CardDescription>
                              </CardHeader>
                              <CardContent>
                                <Web3Button
                                  key={nft.metadata.id}
                                  style={{
                                    width: "100%",
                                    transition: "all 0.2s ease-in-out",
                                    textAlign: "center",
                                  }}
                                  className="hover:bg-slate-500 hover:text-white"
                                  contractAddress={STAKING_CONTRACT}
                                  action={() => onUnstakeNft(nft.metadata.id)}
                                >
                                  Unstake
                                </Web3Button>
                              </CardContent>
                            </>
                          )}
                        </Card>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {!!ownedNfts?.length && (
            <Card className="rounded">
              <CardHeader>
                <CardTitle>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl">Your Owned NFTs</h3>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-6 justify-items-center lg:grid-cols-2">
                  {ownedNfts.map((nft) => {
                    return (
                      <div key={nft.metadata.id}>
                        <Card className="h-full max-w-xs overflow-hidden rounded bg-zinc-900/20">
                          <div className="relative flex items-center justify-center h-48 md:h-64">
                            <ThirdwebNftMedia
                              metadata={nft.metadata}
                              width="100%"
                              height="100%"
                              style={{
                                objectFit: "cover",
                                objectPosition: "center",
                              }}
                            />
                          </div>
                          {!nftsContractIsLoading && (
                            <>
                              <CardHeader>
                                <CardTitle>{nft.metadata.name}</CardTitle>
                                <CardDescription>{nft.metadata.description}</CardDescription>
                              </CardHeader>
                              <CardContent>
                                <Web3Button
                                  key={nft.metadata.id}
                                  style={{
                                    width: "100%",
                                    transition: "all 0.2s ease-in-out",
                                    textAlign: "center",
                                  }}
                                  className="hover:bg-slate-500 hover:text-white"
                                  contractAddress={STAKING_CONTRACT}
                                  action={() => onStakeNft(nft.metadata.id)}
                                >
                                  Stake
                                </Web3Button>
                              </CardContent>
                            </>
                          )}
                        </Card>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </FramerAnimate>
  );
};

export default StakingPage;
