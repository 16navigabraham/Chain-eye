"use client"

import type { Nft } from "@/services/etherscan"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import Image from "next/image"

interface NftCardProps {
  nft: Nft
}

// A very basic function to generate a placeholder image URL from a string.
// In a real app, you would fetch metadata and get the real image URL.
const generatePlaceholderUrl = (input: string) => {
    const hash = input.split('').reduce((acc, char) => {
        return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    const color = (hash & 0x00FFFFFF).toString(16).toUpperCase();
    const bgColor = `000000`.substring(0, 6 - color.length) + color;
    const textColor = 'FFFFFF';
    return `https://placehold.co/500x500/${bgColor}/${textColor}.png?text=${encodeURIComponent(input.substring(0,3))}`;
}

export function NftCard({ nft }: NftCardProps) {

  // For demo, we can't fetch live metadata. We'll use placeholders.
  const imageUrl = generatePlaceholderUrl(nft.tokenSymbol);

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="aspect-square w-full relative">
            <Image
                src={imageUrl}
                alt={`Image of ${nft.tokenName}`}
                layout="fill"
                objectFit="cover"
                data-ai-hint={`${nft.tokenName} logo`}
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