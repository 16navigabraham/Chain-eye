"use client"

import type { Nft } from "@/services/etherscan"
import { Skeleton } from "@/components/ui/skeleton"
import { NftCard } from "./nft-card"

interface NftGalleryProps {
  nfts: Nft[] | null
  isLoading: boolean
}

export function NftGallery({ nfts, isLoading }: NftGalleryProps) {

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-auto w-full aspect-square" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  if (!nfts || nfts.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-16">
        No NFTs found for this address.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-6">
      {nfts.map((nft) => (
        <NftCard key={`${nft.contractAddress}-${nft.tokenID}`} nft={nft} />
      ))}
    </div>
  )
}