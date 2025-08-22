"use client"

import { useState, useEffect } from "react"
import { getTransactions } from "@/app/actions"
import type { Transaction } from "@/services/etherscan"

import { Button } from "@/components/ui/button"
import { ChainEyeIcon } from "@/components/icons"
import { OverviewCards } from "@/components/overview-cards"
import { TokenHoldings } from "@/components/token-holdings"
import { RecentTransactions } from "@/components/recent-transactions"
import { ContractInteractions } from "@/components/contract-interactions"
import { RiskAnalysis } from "@/components/risk-analysis"
import { useToast } from "@/hooks/use-toast"


interface DashboardProps {
  address: string
  blockchain: string
  onReset: () => void
}

export function Dashboard({ address, blockchain, onReset }: DashboardProps) {
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchAllData = async () => {
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
    fetchAllData();
  }, [address, blockchain, toast]);


  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <header className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center space-x-3">
          <ChainEyeIcon className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground font-headline">
            ChainEye
          </h1>
        </div>
        <div className="flex-grow sm:flex-grow-0">
          <p className="text-sm text-muted-foreground break-all">
            <span className="font-semibold text-foreground">Analyzing: </span>{address}
          </p>
        </div>
        <Button onClick={onReset} variant="outline">New Analysis</Button>
      </header>

      <div className="space-y-6">
        <RiskAnalysis address={address} blockchain={blockchain} />
        
        <OverviewCards transactions={transactions} isLoading={isLoading} address={address} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TokenHoldings address={address} blockchain={blockchain} />
          </div>
          <div className="lg:col-span-1">
            <ContractInteractions transactions={transactions} isLoading={isLoading} />
          </div>
        </div>

        <RecentTransactions transactions={transactions?.slice(0, 10) ?? null} isLoading={isLoading} address={address} />
      </div>
    </div>
  )
}
