'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Paddle } from '@paddle/paddle-js';
import { getPaddle, openCheckout, CheckoutOptions } from '@/lib/paddle/client';
import { PLANS, PlanType, BillingInterval } from '@/lib/paddle/config';

interface PaddleContextType {
  paddle: Paddle | null;
  isLoading: boolean;
  checkout: (options: CheckoutOptions) => Promise<void>;
  plans: typeof PLANS;
}

const PaddleContext = createContext<PaddleContextType | null>(null);

export function PaddleProvider({ children }: { children: ReactNode }) {
  const [paddle, setPaddle] = useState<Paddle | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        const instance = await getPaddle();
        setPaddle(instance);
      } catch (error) {
        console.error('Failed to initialize Paddle:', error);
      } finally {
        setIsLoading(false);
      }
    }

    init();
  }, []);

  const checkout = async (options: CheckoutOptions) => {
    await openCheckout(options);
  };

  return (
    <PaddleContext.Provider
      value={{
        paddle,
        isLoading,
        checkout,
        plans: PLANS,
      }}
    >
      {children}
    </PaddleContext.Provider>
  );
}

export function usePaddle() {
  const context = useContext(PaddleContext);
  if (!context) {
    throw new Error('usePaddle must be used within a PaddleProvider');
  }
  return context;
}

// Convenience hook for checkout
export function useCheckout() {
  const { checkout, isLoading } = usePaddle();

  const startCheckout = async (plan: PlanType, email?: string, interval: BillingInterval = 'monthly') => {
    if (plan === 'free') {
      // Redirect to signup for free plan
      window.location.href = '/signup';
      return;
    }

    await checkout({
      plan,
      interval,
      email,
      successUrl: `${window.location.origin}/dashboard?subscription=success&plan=${plan}&interval=${interval}`,
    });
  };

  return { startCheckout, isLoading };
}
