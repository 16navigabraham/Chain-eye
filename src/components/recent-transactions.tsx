"use client"

import { useEffect, useState } from "react"
import { getTransactions } from "@/app/actions"
import type { Transaction } from "@/services/etherscan"

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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ArrowDownLeft, ArrowUpRight, FileText, XCircle, AlertTriangle } from "lucide-react"

interface RecentTransactionsProps {
  address: string;
  blockchain: string;
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

export function RecentTransactions({ address, blockchain }: RecentTransactionsProps) {
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      setError(null);
      const result = await getTransactions(address, blockchain);
      if (result.success && result.transactions) {
        setTransactions(result.transactions);
      } else {
        setError(result.error || "An unknown error occurred.");
      }
      setIsLoading(false);
    };
    fetchTransactions();
  }, [address, blockchain]);
  
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

    if (error) {
      return (
        <TableBody>
          <TableRow>
            <TableCell colSpan={4}>
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error Fetching Transactions</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </TableCell>
          </TableRow>
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
