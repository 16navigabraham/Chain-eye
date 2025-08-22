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
import { ArrowDownLeft, ArrowUpRight, FileText, XCircle } from "lucide-react"

const transactions = [
  {
    hash: "0x1b2c...d4e5",
    type: "Outgoing",
    from: "0xde0b...7bae",
    to: "0xa1b2...8f9e",
    value: "1.5 ETH",
  },
  {
    hash: "0x3c4d...a6b7",
    type: "Incoming",
    from: "0xc5d6...1a2b",
    to: "0xde0b...7bae",
    value: "0.75 ETH",
  },
  {
    hash: "0x5e6f...b8c9",
    type: "Contract",
    from: "0xde0b...7bae",
    to: "Uniswap V3 Router",
    value: "0 ETH",
  },
  {
    hash: "0x7a8b...e0d1",
    type: "Failed",
    from: "0xde0b...7bae",
    to: "0x1inch Aggregator",
    value: "0 ETH",
  },
  {
    hash: "0x9c0d...f2e3",
    type: "Incoming",
    from: "0xf3g4...c5d6",
    to: "0xde0b...7bae",
    value: "1,000 USDC",
  },
]

const typeMapping = {
    Outgoing: {
        icon: ArrowUpRight,
        variant: "secondary",
        className: "text-red-500",
    },
    Incoming: {
        icon: ArrowDownLeft,
        variant: "secondary",
        className: "text-green-500",
    },
    Contract: {
        icon: FileText,
        variant: "secondary",
        className: "text-blue-500",
    },
    Failed: {
        icon: XCircle,
        variant: "destructive",
        className: "opacity-70",
    }
};

export function RecentTransactions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>A log of the most recent transactions from on-chain data.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>From</TableHead>
              <TableHead>To</TableHead>
              <TableHead className="text-right">Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((tx) => {
                const mapping = typeMapping[tx.type as keyof typeof typeMapping] || typeMapping.Contract;
                const Icon = mapping.icon;
                return (
                    <TableRow key={tx.hash}>
                        <TableCell>
                            <Badge variant={mapping.variant as any} className={mapping.className}>
                                <Icon className="mr-2 h-4 w-4" />
                                {tx.type}
                            </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-xs">{tx.from}</TableCell>
                        <TableCell className="font-mono text-xs">{tx.to}</TableCell>
                        <TableCell className="text-right font-medium tabular-nums">{tx.value}</TableCell>
                    </TableRow>
                )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
