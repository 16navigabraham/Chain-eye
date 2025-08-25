"use client"

import { useState, useEffect } from "react"
import { getTransactions } from "@/app/actions"
import type { Transaction } from "@/services/etherscan"
import { useToast } from "@/hooks/use-toast"
import { RecentTransactions } from "@/components/recent-transactions"
import { ContractInteractions } from "@/components/contract-interactions"

interface TransactionsPageProps {
  params: {
    address: string
    blockchain: string
  }
}

export default function TransactionsPage({ params }: TransactionsPageProps) {
  const { address, blockchain } = params
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <RecentTransactions transactions={transactions} isLoading={isLoading} address={address} />
        </div>
        <div className="lg:col-span-1">
            <ContractInteractions transactions={transactions} isLoading={isLoading} />
        </div>
    </div>
  )
}
