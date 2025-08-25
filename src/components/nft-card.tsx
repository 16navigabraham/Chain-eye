"use client"

import type { Nft } from "@/services/etherscan"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import Image from "next/image"

interface NftCardProps {
  nft: Nft
}

export function NftCard({ nft }: NftCardProps) {
  // Use a proxy to try and fetch the NFT image.
  // This is a much simpler approach than a full client-side web3 implementation.
  // We are using a public service; in a production app, you'd use a dedicated service with an API key.
  const imageUrl = `https://images.covalenthq.com/images/8453/${nft.contractAddress}/${nft.tokenID}.png`;
  const fallbackUrl = "https://placehold.co/500x500.png";

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = fallbackUrl;
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="aspect-square w-full relative">
            <Image
                src={imageUrl}
                alt={`Image of ${nft.tokenName}`}
                layout="fill"
                objectFit="cover"
                onError={handleError}
            />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start p-4">
        <p className="text-sm font-semibold text-primary truncate w-full" title={nft.tokenName}>
          {nft.tokenName || "Unnamed NFT"}
        </p>
        <p className="text-xs text-muted-foreground">
          ID: {nft.tokenID}
        </p>
      </CardFooter>
    </Card>
  )
}
