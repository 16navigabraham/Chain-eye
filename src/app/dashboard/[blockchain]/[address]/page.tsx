"use client"

import { useState, useEffect } from "react"
import { getTransactions, getNfts } from "@/app/actions"
import type { Transaction, Nft } from "@/services/etherscan"
import { useToast } from "@/hooks/use-toast"

import { OverviewCards } from "@/components/overview-cards"
import { RiskAnalysis } from "@/components/risk-analysis"

interface DashboardPageProps {
  params: {
    address: string
    blockchain: string
  }
}

export default function DashboardPage({ params }: DashboardPageProps) {
  const { address, blockchain } = params
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);
  const [nfts, setNfts] = useState<Nft[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingNfts, setIsLoadingNfts] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchTxs = async () => {
      setIsLoading(true);
      const txResult = await getTransactions(address, blockchain);
      if (txResult.success && txResult.transactions) {
        setTransactions(txResult.transactions);
      } else {
         toast({
          variant: "destructive",
          title: "Failed to Fetch Transactions",
          description: txResult.error || "Could not load transaction history.",
        })
      }
      setIsLoading(false);
    };

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

    fetchTxs();
    fetchNfts();
  }, [address, blockchain, toast]);

  return (
      <div className="space-y-6">
        <RiskAnalysis address={address} blockchain={blockchain} />
        <OverviewCards transactions={transactions} isLoading={isLoading} address={address} nfts={nfts} isLoadingNfts={isLoadingNfts}/>
      </div>
  )
}
