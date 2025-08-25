"use client"

import type { Nft } from "@/services/etherscan"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import Image from "next/image"

interface NftCardProps {
  nft: Nft
}

export function NftCard({ nft }: NftCardProps) {
  // A real implementation would fetch metadata and get the image URL.
  // For now, we use a generic placeholder as we don't have a metadata service.
  const imageUrl = "https://placehold.co/500x500.png";

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="aspect-square w-full relative">
            <Image
                src={imageUrl}
                alt={`Image of ${nft.tokenName}`}
                layout="fill"
                objectFit="cover"
            />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start p-4">
        <p className="text-sm font-semibold text-primary truncate w-full" title={nft.tokenName}>
          {nft.tokenName}
        </p>
        <p className="text-xs text-muted-foreground">
          ID: {nft.tokenID}
        </p>
      </CardFooter>
    </Card>
  )
}
