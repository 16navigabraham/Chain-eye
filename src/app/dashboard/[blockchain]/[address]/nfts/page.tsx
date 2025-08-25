"use client"

import { useState, useEffect } from "react"
import { getNfts } from "@/app/actions"
import type { Nft } from "@/services/etherscan"
import { useToast } from "@/hooks/use-toast"
import { NftGallery } from "@/components/nft-gallery"

interface NftsPageProps {
  params: {
    address: string
    blockchain: string
  }
}

export default function NftsPage({ params }: NftsPageProps) {
  const { address, blockchain } = params
  const [nfts, setNfts] = useState<Nft[] | null>(null);
  const [isLoadingNfts, setIsLoadingNfts] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchNfts = async () => {
      setIsLoadingNfts(true);
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
      setIsLoadingNfts(false);
    };

    fetchNfts();
  }, [address, blockchain, toast]);

  return (
      <NftGallery nfts={nfts} isLoading={isLoadingNfts}/>
  )
}
