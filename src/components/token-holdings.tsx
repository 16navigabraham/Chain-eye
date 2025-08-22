"use client"

import { useEffect, useState } from "react"
import { getTokens } from "@/app/actions"
import type { Token } from "@/services/etherscan"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

interface TokenHoldingsProps {
  address: string
  blockchain: string
}

export function TokenHoldings({ address, blockchain }: TokenHoldingsProps) {
  const [holdings, setHoldings] = useState<Token[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTokens = async () => {
      setIsLoading(true)
      setError(null)
      const result = await getTokens(address, blockchain)
      if (result.success && result.tokens) {
        // Filter out tokens with no symbol or name, often spam or malformed.
        setHoldings(result.tokens.filter(t => t.symbol && t.name));
      } else {
        setError(result.error || "An unknown error occurred.")
      }
      setIsLoading(false)
    }
    fetchTokens()
  }, [address, blockchain])

  const chartData = (holdings ?? [])
    .map(h => ({ name: h.symbol, value: parseFloat(h.balance) / (10 ** parseInt(h.decimals)) }))
    // Note: We don't have live USD value, so chart may not be representative of portfolio value.
    // For this example, we chart the balance itself. A real app would need a price feed.
    // Filter top 5 by balance for a cleaner chart.
    .sort((a,b) => b.value - a.value)
    .slice(0, 5);


  const renderBody = () => {
    if (isLoading) {
      return (
         <div className="space-y-4">
          <Skeleton className="h-64 w-full" />
           <div className="space-y-2">
              {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
           </div>
         </div>
      )
    }

    if (error) {
       return (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error Fetching Tokens</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
       )
    }
    
    if (!holdings || holdings.length === 0) {
       return (
        <div className="text-center text-muted-foreground py-8">
          No token holdings found for this address.
        </div>
      );
    }
    
    return (
      <div className="space-y-6">
        <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${Number(value).toFixed(2)}`} />
                    <Tooltip
                        cursor={{ fill: 'hsl(var(--accent))' }}
                        contentStyle={{
                            background: 'hsl(var(--background))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: 'var(--radius)',
                        }}
                    />
                    <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Token</TableHead>
              <TableHead className="text-right">Balance</TableHead>
              <TableHead className="text-right">Symbol</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {holdings.map((holding) => (
              <TableRow key={holding.contractAddress}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Image
                      src={`https://placehold.co/32x32.png`}
                      data-ai-hint={`${holding.name} logo`}
                      alt={`${holding.name} logo`}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <div>
                      <div className="font-medium">{holding.name}</div>
                      <div className="text-sm text-muted-foreground">{holding.contractAddress.substring(0,10)}...</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right tabular-nums">
                    {(parseFloat(holding.balance) / (10 ** parseInt(holding.decimals))).toLocaleString(undefined, {minimumFractionDigits: 4, maximumFractionDigits: 4})}
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant="outline">{holding.symbol}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Token Holdings</CardTitle>
        <CardDescription>A list of tokens discovered for this wallet.</CardDescription>
      </CardHeader>
      <CardContent>
          {renderBody()}
      </CardContent>
    </Card>
  )
}
