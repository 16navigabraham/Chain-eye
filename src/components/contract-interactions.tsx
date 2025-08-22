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

const interactions = [
  {
    contract: "Uniswap V3 Router",
    address: "0x68b3...22Ac",
    verified: true,
    count: 125,
    gas: "1.2 ETH",
  },
  {
    contract: "Aave V2 Lending Pool",
    address: "0x7d27...6FE",
    verified: true,
    count: 42,
    gas: "0.8 ETH",
  },
  {
    contract: "Unknown Contract",
    address: "0x1c8a...9b4D",
    verified: false,
    count: 3,
    gas: "0.05 ETH",
  },
  {
    contract: "OpenSea Seaport",
    address: "0x0000...e81E",
    verified: true,
    count: 88,
    gas: "0.95 ETH",
  },
]

export function ContractInteractions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contract Interactions</CardTitle>
        <CardDescription>Contracts this address has interacted with.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contract</TableHead>
              <TableHead className="text-right">Interactions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {interactions.map((interaction) => (
              <TableRow key={interaction.address}>
                <TableCell>
                  <div className="font-medium">{interaction.contract}</div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground">
                      {interaction.address}
                    </span>
                    <Badge variant={interaction.verified ? "default" : "destructive"} className="h-5">
                      {interaction.verified ? "Verified" : "Unverified"}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="font-medium tabular-nums">{interaction.count}</div>
                  <div className="text-xs text-muted-foreground tabular-nums">{interaction.gas} spent</div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
