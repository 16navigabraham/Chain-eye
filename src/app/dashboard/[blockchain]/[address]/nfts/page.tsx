import { NftGallery } from "@/components/nft-gallery"

interface NftsPageProps {
  params: {
    address: string
    blockchain: string
  }
}

export default function NftsPage({ params }: NftsPageProps) {
  const { address, blockchain } = params

  return (
      <NftGallery address={address} blockchain={blockchain}/>
  )
}
