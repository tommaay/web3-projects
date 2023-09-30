"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "components/ui/Card";
import {
  useContract,
  useContractMetadata,
  MediaRenderer,
} from "@thirdweb-dev/react";
import { SpinnerRoundFilled } from "spinners-react";

type ContractCardProps = {
  href: string;
  contractAddress: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  altText?: string;
  style?: Record<string, string>;
};

function ContractCard({
  href,
  contractAddress,
  title,
  description,
  imageUrl = "no-image.svg",
  altText = "This contract has no image text.",
  style,
}: ContractCardProps) {
  const { contract, isLoading: contractIsLoading } =
    useContract(contractAddress);
  const { data: metadata, isLoading: metadataIsLoading } =
    useContractMetadata(contract);

  return (
    <Link href={href}>
      <Card className="h-full max-w-xs overflow-hidden rounded-xl hover:scale-105 bg-zinc-900/20">
        <div className="relative flex items-center justify-center h-48 md:h-64">
          {contractIsLoading || metadataIsLoading ? (
            <SpinnerRoundFilled size={86} color="#fff" />
          ) : (
            <>
              {metadata?.image ? (
                <MediaRenderer
                  src={metadata.image}
                  width="100%"
                  height="100%"
                  style={{
                    objectFit: "cover",
                    objectPosition: "center",
                    ...style,
                  }}
                />
              ) : (
                <Image
                  src={imageUrl}
                  alt={altText}
                  fill={true}
                  style={{
                    objectFit: "cover",
                    objectPosition: "center",
                    ...style,
                  }}
                />
              )}
            </>
          )}
        </div>
        {!contractIsLoading && !metadataIsLoading && (
          <CardHeader>
            <CardTitle>{title || metadata?.name}</CardTitle>
            <CardDescription>
              {description || metadata?.description}
            </CardDescription>
          </CardHeader>
        )}
      </Card>
    </Link>
  );
}

export default ContractCard;
