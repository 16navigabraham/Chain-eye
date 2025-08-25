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
import type { Transaction } from "@/services/etherscan"
import { getTransactions } from "@/app/actions"
import { useToast } from "@/hooks/use-toast"

interface ContractInteractionsProps {
    address: string;
    blockchain: string;
}

interface Interaction {
    address: string;
    count: number;
    gasSpent: number; // in ETH
    isVerified: boolean; // This would require another API call, defaulting to false
    name: string; // This would require reverse lookup or ABI decoding, defaulting to address
}

export function ContractInteractions({ address, blockchain }: ContractInteractionsProps) {
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


  const interactionMap = (transactions ?? [])
    .filter(tx => tx.to && tx.input !== "0x") // Filter for contract interactions
    .reduce((acc, tx) => {
        const to = tx.to!.toLowerCase();
        let interaction = acc.get(to);
        if (!interaction) {
            interaction = {
                address: tx.to!,
                count: 0,
                gasSpent: 0,
                isVerified: tx.contractAddress ? true : false, // Simple assumption
                name: `Contract ${tx.to!.substring(0, 6)}...`
            };
        }
        interaction.count++;
        interaction.gasSpent += (parseInt(tx.gasUsed) * parseInt(tx.gasPrice)) / 1e18;
        acc.set(to, interaction);
        return acc;
    }, new Map<string, Interaction>());
    
  const interactions = Array.from(interactionMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 10); // Top 10 interactions

  const renderBody = () => {
    if (isLoading) {
      return (
         <TableBody>
            {[...Array(3)].map((_, i) => (
                <TableRow key={i}>
                    <TableCell colSpan={2}><Skeleton className="h-8 w-full" /></TableCell>
                </TableRow>
            ))}
         </TableBody>
      )
    }
    
    if (!interactions || interactions.length === 0) {
        return (
            <TableBody>
                <TableRow>
                <TableCell colSpan={2} className="text-center">
                    No contract interactions found.
                </TableCell>
                </TableRow>
            </TableBody>
        );
    }
    
    return (
       <TableBody>
            {interactions.map((interaction) => (
              <TableRow key={interaction.address}>
                <TableCell>
                  <div className="font-medium">{interaction.name}</div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground">
                      {interaction.address}
                    </span>
                     {/* Verification status would require another API call, this is a placeholder */}
                    <Badge variant={"outline"} className="h-5">
                      Unknown
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="font-medium tabular-nums">{interaction.count}</div>
                  <div className="text-xs text-muted-foreground tabular-nums">{interaction.gasSpent.toFixed(5)} ETH spent</div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
    )

  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contract Interactions</CardTitle>
        <CardDescription>Top contracts this address has interacted with.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contract</TableHead>
              <TableHead className="text-right">Interactions</TableHead>
            </TableRow>
          </TableHeader>
          {renderBody()}
        </Table>
      </CardContent>
    </Card>
  )
}
