import { RecentTransactions } from "@/components/recent-transactions"

interface TransactionsPageProps {
  params: {
    address: string
    blockchain: string
  }
}

export default function TransactionsPage({ params }: TransactionsPageProps) {
  const { address, blockchain } = params
  
  return (
    <RecentTransactions address={address} blockchain={blockchain} />
  )
}
