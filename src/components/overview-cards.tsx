"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDown, ArrowUp, ArrowRightLeft, Landmark } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import type { Transaction } from "@/services/etherscan"

interface OverviewCardsProps {
    transactions: Transaction[] | null;
    isLoading: boolean;
    address: string;
}

export function OverviewCards({ transactions, isLoading, address }: OverviewCardsProps) {
  
  const stats = [
    {
      title: "Total Transactions",
      value: transactions?.length.toLocaleString() ?? "0",
      icon: ArrowRightLeft,
    },
    {
      title: "Total Incoming",
      value: transactions?.filter(tx => tx.to.toLowerCase() === address.toLowerCase()).length.toLocaleString() ?? "0",
      icon: ArrowDown,
    },
    {
      title: "Total Outgoing",
      value: transactions?.filter(tx => tx.from.toLowerCase() === address.toLowerCase()).length.toLocaleString() ?? "0",
      icon: ArrowUp,
    },
     {
      title: "Contract Interactions",
      value: transactions?.filter(tx => tx.contractAddress !== "" || (tx.to && tx.input && tx.input !== "0x")).length.toLocaleString() ?? "0",
      icon: Landmark,
    },
  ]

  if (isLoading) {
      return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
                <Card key={i}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-6 w-16 mb-2" />
                        <Skeleton className="h-3 w-20" />
                    </CardContent>
                </Card>
            ))}
        </div>
      )
  }
  
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">transactions</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
