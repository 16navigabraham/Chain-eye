"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AddressForm, type FormData } from '@/components/address-form';
import { ChainEyeIcon } from '@/components/icons';

export default function Home() {
  const router = useRouter();

  const handleAnalyze = (data: FormData) => {
    router.push(`/dashboard/${data.blockchain}/${data.address}`);
  };

  return (
    <main className="bg-background min-h-screen">
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
    </main>
  );
}
