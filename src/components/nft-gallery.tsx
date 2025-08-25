"use client"

import { useState, useEffect } from "react"
import type { Nft } from "@/services/etherscan"
import { Skeleton } from "@/components/ui/skeleton"
import { NftCard } from "./nft-card"
import { getNfts } from "@/app/actions"
import { useToast } from "@/hooks/use-toast"

interface NftGalleryProps {
  address: string
  blockchain: string
}

export function NftGallery({ address, blockchain }: NftGalleryProps) {
  const [nfts, setNfts] = useState<Nft[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchNfts = async () => {
      setIsLoading(true);
      const nftResult = await getNfts(address, blockchain);
       if (nftResult.success && nftResult.nfts) {
        setNfts(nftResult.nfts);
      } else {
         toast({
          variant: "destructive",
          title: "Failed to Fetch NFTs",
          description: nftResult.error || "Could not load NFT holdings.",
        })
      }
      setIsLoading(false);
    };

    fetchNfts();
  }, [address, blockchain, toast]);


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
