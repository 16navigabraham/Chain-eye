"use client"

import { Button } from "@/components/ui/button"
import { ChainEyeIcon } from "@/components/icons"
import { OverviewCards } from "@/components/overview-cards"
import { TokenHoldings } from "@/components/token-holdings"
import { RecentTransactions } from "@/components/recent-transactions"
import { ContractInteractions } from "@/components/contract-interactions"
import { RiskAnalysis } from "@/components/risk-analysis"

interface DashboardProps {
  address: string
  blockchain: string
  onReset: () => void
}

export function Dashboard({ address, blockchain, onReset }: DashboardProps) {
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
        
        <OverviewCards />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TokenHoldings />
          </div>
          <div className="lg:col-span-1">
            <ContractInteractions />
          </div>
        </div>

        <RecentTransactions />
      </div>
    </div>
  )
}
