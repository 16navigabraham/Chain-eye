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
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <RecentTransactions address={address} blockchain={blockchain} />
        </div>
        <div className="lg:col-span-1">
            <ContractInteractions address={address} blockchain={blockchain} />
        </div>
    </div>
  )
}
