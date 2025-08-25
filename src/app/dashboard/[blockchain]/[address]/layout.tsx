"use client"

import {
  Home,
  ArrowRightLeft,
  Coins,
  ImageIcon,
  LogOut,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from 'next/navigation'

import { Button } from "@/components/ui/button"
import { ChainEyeIcon } from "@/components/icons"
import { Chatbot } from "@/components/chatbot"
import { cn } from "@/lib/utils"

interface DashboardLayoutProps {
    children: React.ReactNode
    params: { address: string; blockchain: string }
}

const navigation = [
    { name: "Overview", href: "", icon: Home },
    { name: "Tokens", href: "/tokens", icon: Coins },
    { name: "Transactions", href: "/transactions", icon: ArrowRightLeft },
    { name: "NFTs", href: "/nfts", icon: ImageIcon },
]

export default function DashboardLayout({ children, params }: DashboardLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { address, blockchain } = params
  
  const handleReset = () => {
    router.push('/')
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <ChainEyeIcon className="h-6 w-6 text-primary" />
              <span className="">ChainEye</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {navigation.map((item) => {
                const href = `/dashboard/${blockchain}/${address}${item.href}`
                const isActive = item.href === "" ? pathname === href : pathname.startsWith(href)
                return (
                  <Link
                    key={item.name}
                    href={href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                      isActive && "bg-muted text-primary"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
           <div className="w-full flex-1">
             <p className="text-sm text-muted-foreground break-all">
                <span className="font-semibold text-foreground">Analyzing: </span>{address}
            </p>
           </div>
          <Button onClick={handleReset} variant="outline" size="sm">
            <LogOut className="mr-2 h-4 w-4"/>
            New Analysis
          </Button>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
            {children}
        </main>
        <Chatbot address={address} blockchain={blockchain} />
      </div>
    </div>
  )
}
