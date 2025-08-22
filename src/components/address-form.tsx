"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const formSchema = z.object({
  address: z.string().min(26, {
    message: "A valid address is typically longer.",
  }).max(64, {
    message: "An address cannot be this long."
  }).regex(/^0x[a-fA-F0-9]{40}$|^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$/, {
    message: "Please enter a valid crypto address.",
  }),
  blockchain: z.string({
    required_error: "Please select a blockchain.",
  }),
})

export type FormData = z.infer<typeof formSchema>

interface AddressFormProps {
  onAnalyze: (data: FormData) => void
}

const blockchains = [
  { value: "ethereum", label: "Ethereum" },
  { value: "base_mainnet", label: "Base Mainnet" },
  { value: "base_sepolia", label: "Base Sepolia" },
  { value: "bsc", label: "BNB Smart Chain (BSC)" },
  { value: "polygon", label: "Polygon" },
  { value: "arbitrum", label: "Arbitrum" },
]

export function AddressForm({ onAnalyze }: AddressFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: "",
      blockchain: "ethereum",
    },
  })

  const { isSubmitting } = form.formState;

  return (
    <Card className="w-full max-w-2xl shadow-2xl">
      <CardHeader>
        <CardTitle className="text-center text-xl">Analyze Wallet Address</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onAnalyze)} className="space-y-6">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Wallet Address</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="blockchain"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Blockchain</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a blockchain" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {blockchains.map((chain) => (
                        <SelectItem key={chain.value} value={chain.value}>
                          {chain.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Search className="mr-2 h-4 w-4" />
              )}
              Analyze Address
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
