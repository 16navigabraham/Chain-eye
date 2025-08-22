"use client"

import { useEffect, useState, useMemo } from "react"
import { generateRiskSummary } from "@/app/actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ShieldAlert, ShieldCheck, AlertTriangle, Info } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface RiskAnalysisProps {
  address: string
  blockchain: string
}

export function RiskAnalysis({ address, blockchain }: RiskAnalysisProps) {
  const [summary, setSummary] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast();

  useEffect(() => {
    const getSummary = async () => {
      setIsLoading(true)
      setError(null)
      const result = await generateRiskSummary({ address, blockchain })
      if (result.success && result.summary) {
        setSummary(result.summary)
      } else {
        setError(result.error || "An unknown error occurred.")
        toast({
          variant: "destructive",
          title: "AI Analysis Failed",
          description: result.error || "Could not generate the risk summary.",
        })
      }
      setIsLoading(false)
    }
    getSummary()
  }, [address, blockchain, toast])
  
  const riskLevel = useMemo(() => {
    if (!summary) return 'unknown';
    const lowercasedSummary = summary.toLowerCase();
    if (lowercasedSummary.includes('high risk')) return 'high';
    if (lowercasedSummary.includes('caution') || lowercasedSummary.includes('unverified')) return 'medium';
    return 'low';
  }, [summary]);

  const RiskIcon = {
    high: ShieldAlert,
    medium: AlertTriangle,
    low: ShieldCheck,
    unknown: Info
  }[riskLevel];

  const riskCardVariant = {
    high: "border-destructive",
    medium: "border-yellow-500",
    low: "border-green-500",
    unknown: ""
  }[riskLevel];
  
  const riskTitleColor = {
      high: "text-destructive",
      medium: "text-yellow-500",
      low: "text-green-500",
      unknown: "text-muted-foreground"
  }[riskLevel];


  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-6 w-48" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
       <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Card className={riskCardVariant}>
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${riskTitleColor}`}>
          <RiskIcon className="h-6 w-6" />
          AI-Powered Risk Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-base text-foreground/90">{summary}</p>
      </CardContent>
    </Card>
  )
}
