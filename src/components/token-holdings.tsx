"use client"

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

const holdings = [
  {
    token: "Ethereum",
    symbol: "ETH",
    balance: "12.45",
    value: "$42,321.80",
    logo: "/eth.png",
    change: "+1.5%",
    changeType: "increase",
  },
  {
    token: "USD Coin",
    symbol: "USDC",
    balance: "10,500.00",
    value: "$10,500.00",
    logo: "/usdc.png",
    change: "+0.0%",
    changeType: "neutral",
  },
  {
    token: "Uniswap",
    symbol: "UNI",
    balance: "530.12",
    value: "$5,831.32",
    logo: "/uni.png",
    change: "-3.2%",
    changeType: "decrease",
  },
  {
    token: "Chainlink",
    symbol: "LINK",
    balance: "1,200.50",
    value: "$18,607.75",
    logo: "/link.png",
    change: "+5.8%",
    changeType: "increase",
  },
  {
    token: "Pepe",
    symbol: "PEPE",
    balance: "1,500,000,000",
    value: "$16,500.00",
    logo: "/pepe.png",
    change: "-12.1%",
    changeType: "decrease",
  },
]

const chartData = holdings.map(h => ({ name: h.symbol, value: parseFloat(h.value.replace('$', '').replace(/,/g, '')) }));

export function TokenHoldings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Token Holdings</CardTitle>
        <CardDescription>A list of tokens in the wallet and their current value.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${(Number(value) / 1000)}k`} />
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
              <TableHead className="text-right">24h Change</TableHead>
              <TableHead className="text-right">Value (USD)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {holdings.map((holding) => (
              <TableRow key={holding.symbol}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Image
                      src={`https://placehold.co/32x32.png`}
                      data-ai-hint={`${holding.token} logo`}
                      alt={`${holding.token} logo`}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <div>
                      <div className="font-medium">{holding.token}</div>
                      <div className="text-sm text-muted-foreground">{holding.symbol}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right tabular-nums">{holding.balance}</TableCell>
                <TableCell className="text-right">
                  <Badge
                    variant="outline"
                    className={
                      holding.changeType === "increase"
                        ? "text-green-500 border-green-500"
                        : holding.changeType === "decrease"
                        ? "text-red-500 border-red-500"
                        : ""
                    }
                  >
                    {holding.change}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-medium tabular-nums">{holding.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
