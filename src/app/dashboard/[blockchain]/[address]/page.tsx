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

  return (
      <div className="space-y-6">
        <RiskAnalysis address={address} blockchain={blockchain} />
        <OverviewCards address={address} blockchain={blockchain} />
      </div>
  )
}
