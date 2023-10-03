"use client";

import {
  ThirdwebNftMedia,
  useAddress,
  useTotalCirculatingSupply,
  useContract,
  useContractMetadata,
  useOwnedNFTs,
  useTotalCount,
  Web3Button,
} from "@thirdweb-dev/react";
import HeroCard from "components/HeroCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "components/ui/Card";
import { SpinnerRoundFilled } from "spinners-react";
import { ERC1155_CONTRACT } from "@/constants";
import { useToast } from "components/ui/useToast";
import FramerAnimate from "components/FramerAnimate";

const Erc1155Page = () => {
  const address = useAddress();
  const { contract, isLoading: contractIsLoading } = useContract(ERC1155_CONTRACT);
  const { isLoading: metadataIsLoading } = useContractMetadata(contract);
  const { data: totalSupply, isLoading: totalSupplyIsLoading } = useTotalCount(contract);
  const { data: totalCirculatingOne, isLoading: totalCirculatingOneIsLoading } =
    useTotalCirculatingSupply(contract, 0);
  const { data: totalCirculatingTwo, isLoading: totalCirculatingTwoIsLoading } =
    useTotalCirculatingSupply(contract, 0);
  const { data: ownedNfts } = useOwnedNFTs(contract, address);

  const isLoading =
    contractIsLoading ||
    metadataIsLoading ||
    totalSupplyIsLoading ||
    totalCirculatingOneIsLoading ||
    totalCirculatingTwoIsLoading;

  const { toast } = useToast();

  return (
    <FramerAnimate>
      <main className="container py-sm md:py-md">
        <HeroCard
          title="Cypher Dudes NFTs ERC1155"
          description="Cyperpunk Dudes. A test ERC1155 contract."
          imageUrl="/cypherpunk_guy_with_swords_1.png"
          altText="Cypher Dudes NFT"
          isLoading={false}
        />

        {isLoading ? (
          <SpinnerRoundFilled color="#fff" className="mx-auto mt-10" />
        ) : (
          <div className="grid grid-cols-1 gap-4 pt-12 md:gap-8 sm:grid-cols-3">
            <Card className="h-full rounded">
              <CardHeader>
                <CardTitle>
                  <h3>NFT stats</h3>
                </CardTitle>
                <CardDescription>
                  <p className="text-lg font-medium">
                    Number of NFT types:{" "}
                    {totalSupplyIsLoading ? (
                      <SpinnerRoundFilled color="#fff" />
                    ) : (
                      totalSupply?.toString()
                    )}
                  </p>
                  <p className="text-lg font-medium">
                    Art NFTs claimed:{" "}
                    {totalCirculatingOneIsLoading ? (
                      <SpinnerRoundFilled color="#fff" />
                    ) : (
                      totalCirculatingOne?.toString()
                    )}
                  </p>
                  <p className="text-lg font-medium">
                    Membership NFTs claimed:{" "}
                    {totalCirculatingTwoIsLoading ? (
                      <SpinnerRoundFilled color="#fff" />
                    ) : (
                      totalCirculatingTwo?.toString()
                    )}
                  </p>
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="h-full rounded">
              <CardHeader>
                <CardTitle>
                  <h3>Your NFTs</h3>
                </CardTitle>
                {address ? (
                  <CardDescription>
                    <p className="text-lg font-medium">
                      Total owned:{" "}
                      {totalSupplyIsLoading ? (
                        <SpinnerRoundFilled color="#fff" />
                      ) : (
                        ownedNfts?.length || 0
                      )}
                    </p>
                  </CardDescription>
                ) : (
                  <CardDescription>
                    <p className="text-lg font-medium">
                      Please connect your wallet to see your NFT data
                    </p>
                  </CardDescription>
                )}
              </CardHeader>
            </Card>

            <Card className="h-full rounded">
              <CardHeader>
                <CardTitle>
                  <h3>Mint</h3>
                </CardTitle>
                <CardDescription>
                  <p className="text-lg font-medium">
                    {address
                      ? "Claim a Cypher Dudes NFT!"
                      : "Please connect your wallet to mint an NFT"}
                  </p>
                </CardDescription>
              </CardHeader>
              {address && (
                <CardContent className="flex flex-col gap-4 mt-2 text-center">
                  <Web3Button
                    style={{ width: "100%", transition: "all 0.2s ease-in-out" }}
                    className="hover:bg-slate-500 hover:text-white"
                    contractAddress={ERC1155_CONTRACT}
                    action={(contract) => contract.erc1155.claim(0, 1)}
                    onSuccess={() =>
                      toast({
                        title: "NFT claimed!",
                        description: "You claimed a Cypher Dudes NFT.",
                      })
                    }
                    onError={() =>
                      toast({
                        title: "Error claiming NFT",
                        description: "There was an error claiming your NFT.",
                      })
                    }
                  >
                    Mint Art NFT
                  </Web3Button>

                  <Web3Button
                    style={{ width: "100%", transition: "all 0.2s ease-in-out" }}
                    className="hover:bg-slate-500 hover:text-white"
                    contractAddress={ERC1155_CONTRACT}
                    action={(contract) => contract.erc1155.claim(1, 1)}
                    onSuccess={() =>
                      toast({
                        title: "NFT claimed!",
                        description: "You claimed a Cypher Dudes NFT.",
                      })
                    }
                    onError={() =>
                      toast({
                        title: "Error claiming NFT",
                        description: "There was an error claiming your NFT.",
                      })
                    }
                  >
                    Mint Membership NFT
                  </Web3Button>
                </CardContent>
              )}
            </Card>
          </div>
        )}

        {!!ownedNfts?.length && (
          <>
            <h2 className="mt-10 text-2xl sm:text-3xl md:text-4xl">Your NFTs</h2>
            <div className="grid gap-10 sm:justify-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 py-lg">
              {ownedNfts.map((nft) => (
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
                    {!contractIsLoading && !metadataIsLoading && (
                      <>
                        <CardHeader>
                          <CardTitle>{nft.metadata.name}</CardTitle>
                          <CardDescription>{nft.metadata.description}</CardDescription>
                        </CardHeader>
                      </>
                    )}
                  </Card>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </FramerAnimate>
  );
};

export default Erc1155Page;
