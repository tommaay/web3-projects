"use client";

import {
  MediaRenderer,
  useAddress,
  useClaimedNFTSupply,
  useContract,
  useContractMetadata,
  useOwnedNFTs,
  useTotalCount,
  Web3Button,
} from "@thirdweb-dev/react";
import HeroCard from "components/HeroCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "components/ui/Card";
import { SpinnerRoundFilled } from "spinners-react";
import { ERC721A_CONTRACT } from "@/constants";
import Link from "next/link";
import { useToast } from "components/ui/useToast";

const CypherChicksPage = () => {
  const address = useAddress();
  const { contract, isLoading: contractIsLoading } = useContract(
    ERC721A_CONTRACT,
    "signature-drop"
  );
  const { isLoading: metadataIsLoading } = useContractMetadata(contract);
  const { data: totalSupply, isLoading: totalSupplyIsLoading } = useTotalCount(contract);
  const { data: totalClaimed, isLoading: totalClaimedIsLoading } = useClaimedNFTSupply(contract);
  const { data: ownedNfts, isLoading: ownedNftsIsLoading } = useOwnedNFTs(contract, address);

  const isLoading =
    contractIsLoading || metadataIsLoading || totalSupplyIsLoading || totalClaimedIsLoading;

  const { toast } = useToast();

  return (
    <main className="container py-sm md:py-md">
      <HeroCard
        title="Cypher Chicks NFTs"
        description="Cypherpunk Chicks. A testnet ERC721A NFT contract."
        imageUrl="/cypherpunk_anime_girl_1.png"
        altText="Cypher Chicks NFT"
        isLoading={contractIsLoading || metadataIsLoading}
      />

      {isLoading ? (
        <SpinnerRoundFilled color="#fff" className="mx-auto mt-10" />
      ) : (
        <div className="grid grid-cols-1 gap-8 pt-12 sm:grid-cols-3">
          <Card className="h-full rounded">
            <CardHeader>
              <CardTitle>
                <h3>NFT stats</h3>
              </CardTitle>
              <CardDescription>
                <p className="text-lg font-medium">
                  Total supply:{" "}
                  {totalSupplyIsLoading ? (
                    <SpinnerRoundFilled color="#fff" />
                  ) : (
                    totalSupply?.toString()
                  )}
                </p>
                <p className="text-lg font-medium">
                  Total claimed:{" "}
                  {totalSupplyIsLoading ? (
                    <SpinnerRoundFilled color="#fff" />
                  ) : (
                    totalClaimed?.toString()
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
                <p className="text-lg font-medium">Claim a Cypher Chicks NFT!</p>
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-2">
              <Web3Button
                style={{ width: "100%", transition: "all 0.2s ease-in-out" }}
                className="hover:bg-slate-500 hover:text-white"
                contractAddress={ERC721A_CONTRACT}
                action={(contract) => contract.erc721.claim(1)}
                onSuccess={() =>
                  toast({
                    title: "NFT claimed!",
                    description: "You claimed a Cypher Chicks NFT.",
                  })
                }
                onError={() =>
                  toast({
                    title: "Error claiming NFT",
                    description: "There was an error claiming your NFT.",
                  })
                }
              >
                Mint
              </Web3Button>
            </CardContent>
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
                    <MediaRenderer
                      src={nft.metadata.image}
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
                      <CardContent>
                        <Link
                          href="/staking"
                          className="lg:flex-1 text-black bg-white rounded-[8px] h-11 flex items-center justify-center transition-all ease-in-out hover:bg-slate-500 hover:text-white"
                        >
                          Stake &rarr;
                        </Link>
                      </CardContent>
                    </>
                  )}
                </Card>
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
};

export default CypherChicksPage;
