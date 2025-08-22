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
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowDownLeft, ArrowUpRight, FileText, XCircle } from "lucide-react"
import type { Transaction } from "@/services/etherscan"

interface RecentTransactionsProps {
  address: string;
  transactions: Transaction[] | null;
  isLoading: boolean;
}

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

export function RecentTransactions({ address, transactions, isLoading }: RecentTransactionsProps) {

  const renderBody = () => {
    if (isLoading) {
      return (
        <TableBody>
          {[...Array(5)].map((_, i) => (
            <TableRow key={i}>
              <TableCell colSpan={4}>
                <Skeleton className="h-8 w-full" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      );
    }
    
    if (!transactions || transactions.length === 0) {
       return (
        <TableBody>
          <TableRow>
            <TableCell colSpan={4} className="text-center">
              No recent transactions found.
            </TableCell>
          </TableRow>
        </TableBody>
      );
    }

    return (
       <TableBody>
        {transactions.map((tx) => {
          const isError = tx.isError === "1";
          const isSender = tx.from.toLowerCase() === address.toLowerCase();
          
          let type = "Contract";
          if (isError) {
              type = "Failed";
          } else if (isSender) {
              type = "Outgoing";
          } else {
              type = "Incoming";
          }

          const mapping = typeMapping[type as keyof typeof typeMapping];
          const Icon = mapping.icon;
          
          return (
            <TableRow key={tx.hash}>
              <TableCell>
                <Badge variant={mapping.variant as any} className={mapping.className}>
                  <Icon className="mr-2 h-4 w-4" />
                  {type}
                </Badge>
              </TableCell>
              <TableCell className="font-mono text-xs truncate" style={{maxWidth: '150px'}}>{tx.from}</TableCell>
              <TableCell className="font-mono text-xs truncate" style={{maxWidth: '150px'}}>{tx.to}</TableCell>
              <TableCell className="text-right font-medium tabular-nums">
                {(parseInt(tx.value) / 1e18).toFixed(6)} ETH
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    )
  }

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
          {renderBody()}
        </Table>
      </CardContent>
    </Card>
  )
}
