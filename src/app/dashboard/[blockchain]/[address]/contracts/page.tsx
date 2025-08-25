import { ContractInteractions } from "@/components/contract-interactions"

interface ContractsPageProps {
  params: {
    address: string
    blockchain: string
  }
}

export default function ContractsPage({ params }: ContractsPageProps) {
  const { address, blockchain } = params
  
  return (
    <ContractInteractions address={address} blockchain={blockchain} />
  )
}
