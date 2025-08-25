"use client"

import { useState, useEffect } from "react"
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
import { getTransactions } from "@/app/actions"
import { useToast } from "@/hooks/use-toast"
import { formatDistanceToNow } from 'date-fns'


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
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      
      const txResult = await getTransactions(address, blockchain);
      if (txResult.success && txResult.transactions) {
        setTransactions(txResult.transactions);
      } else {
         toast({
          variant: "destructive",
          title: "Failed to Fetch Transactions",
          description: txResult.error || "Could not load transaction history.",
        })
      }
      
      setIsLoading(false);
    };

    fetchAllData();
  }, [address, blockchain, toast]);

  const renderBody = () => {
    if (isLoading) {
      return (
        <TableBody>
          {[...Array(10)].map((_, i) => (
            <TableRow key={i}>
              <TableCell colSpan={5}>
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
            <TableCell colSpan={5} className="text-center">
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
          const txDate = new Date(parseInt(tx.timeStamp) * 1000);
          
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
               <TableCell className="text-right">
                <div className="font-medium tabular-nums">
                    {(parseInt(tx.value) / 1e18).toFixed(6)} ETH
                </div>
              </TableCell>
              <TableCell className="text-right text-xs text-muted-foreground">
                 <div title={txDate.toLocaleString()}>
                    {formatDistanceToNow(txDate, { addSuffix: true })}
                 </div>
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
        <CardTitle>Transactions</CardTitle>
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
              <TableHead className="text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          {renderBody()}
        </Table>
      </CardContent>
    </Card>
  )
}
