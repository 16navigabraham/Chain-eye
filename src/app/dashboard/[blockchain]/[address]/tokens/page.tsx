import { TokenHoldings } from "@/components/token-holdings"

interface TokensPageProps {
  params: {
    address: string
    blockchain: string
  }
}

export default function TokensPage({ params }: TokensPageProps) {
  const { address, blockchain } = params

  return (
    <TokenHoldings address={address} blockchain={blockchain} />
  )
}
