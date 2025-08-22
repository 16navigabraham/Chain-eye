"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDown, ArrowUp, ArrowRightLeft, Landmark } from "lucide-react"

const stats = [
  {
    title: "Final Balance",
    value: "12.45 ETH",
    change: "+2.1%",
    icon: Landmark,
  },
  {
    title: "Total Transactions",
    value: "1,204",
    change: "+15 since last week",
    icon: ArrowRightLeft,
  },
  {
    title: "Total Incoming",
    value: "25.6 ETH",
    change: "312 transactions",
    icon: ArrowDown,
  },
  {
    title: "Total Outgoing",
    value: "13.15 ETH",
    change: "892 transactions",
    icon: ArrowUp,
  },
]

export function OverviewCards() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
