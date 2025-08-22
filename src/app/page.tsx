"use client";

import { useState } from 'react';
import { AddressForm, type FormData } from '@/components/address-form';
import { Dashboard } from '@/components/dashboard';
import { ChainEyeIcon } from '@/components/icons';

export default function Home() {
  const [analysis, setAnalysis] = useState<{ address: string; blockchain: string } | null>(null);

  const handleAnalyze = (data: FormData) => {
    setAnalysis(data);
  };

  const handleReset = () => {
    setAnalysis(null);
  }

  return (
    <main className="bg-background min-h-screen">
      {!analysis ? (
        <div className="container mx-auto flex flex-col items-center justify-center min-h-screen p-4 text-center">
          <div className="flex items-center space-x-3 mb-4">
            <ChainEyeIcon className="h-12 w-12 text-primary" />
            <h1 className="text-5xl font-bold text-foreground font-headline">
              ChainEye
            </h1>
          </div>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
            Get a comprehensive, AI-powered analysis of any cryptocurrency address. Uncover transaction history, token holdings, and potential risks in one clear dashboard.
          </p>
          <AddressForm onAnalyze={handleAnalyze} />
        </div>
      ) : (
        <Dashboard address={analysis.address} blockchain={analysis.blockchain} onReset={handleReset} />
      )}
    </main>
  );
}
