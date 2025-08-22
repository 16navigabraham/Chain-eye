"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDown, ArrowUp, ArrowRightLeft, Landmark, Image as ImageIcon } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import type { Transaction, Nft } from "@/services/etherscan"

interface OverviewCardsProps {
    transactions: Transaction[] | null;
    nfts: Nft[] | null;
    isLoading: boolean;
    isLoadingNfts: boolean;
    address: string;
}

export function OverviewCards({ transactions, nfts, isLoading, isLoadingNfts, address }: OverviewCardsProps) {
  
  const stats = [
    {
      title: "Total Transactions",
      value: transactions?.length.toLocaleString() ?? "0",
      icon: ArrowRightLeft,
      loading: isLoading
    },
    {
      title: "Total NFTs",
      value: nfts?.length.toLocaleString() ?? "0",
      icon: ImageIcon,
      loading: isLoadingNfts
    },
    {
      title: "Total Outgoing",
      value: transactions?.filter(tx => tx.from.toLowerCase() === address.toLowerCase()).length.toLocaleString() ?? "0",
      icon: ArrowUp,
      loading: isLoading
    },
     {
      title: "Contract Interactions",
      value: transactions?.filter(tx => tx.contractAddress !== "" || (tx.to && tx.input && tx.input !== "0x")).length.toLocaleString() ?? "0",
      icon: Landmark,
      loading: isLoading
    },
  ]
  
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             {stat.loading ? (
                 <Skeleton className="h-4 w-24" />
            ) : (
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            )}
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {stat.loading ? (
                <>
                    <Skeleton className="h-6 w-16 mb-2" />
                    <Skeleton className="h-3 w-20" />
                </>
            ) : (
                <>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">
                        {stat.title === 'Total NFTs' ? 'unique collectibles' : 'transactions'}
                    </p>
                </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}