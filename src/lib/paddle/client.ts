'use client';

import { initializePaddle, Paddle } from '@paddle/paddle-js';
import { PADDLE_CONFIG, PLANS, PlanType } from './config';

let paddleInstance: Paddle | null = null;

export async function getPaddle(): Promise<Paddle | null> {
  if (paddleInstance) {
    return paddleInstance;
  }

  if (!PADDLE_CONFIG.clientToken) {
    console.warn('Paddle client token not configured');
    return null;
  }

  try {
    const instance = await initializePaddle({
      environment: PADDLE_CONFIG.environment,
      token: PADDLE_CONFIG.clientToken,
    });
    paddleInstance = instance || null;
    return paddleInstance;
  } catch (error) {
    console.error('Failed to initialize Paddle:', error);
    return null;
  }
}

export interface CheckoutOptions {
  plan: PlanType;
  email?: string;
  customerId?: string;
  successUrl?: string;
}

export async function openCheckout(options: CheckoutOptions): Promise<void> {
  const paddle = await getPaddle();
  if (!paddle) {
    throw new Error('Paddle not initialized');
  }

  const plan = PLANS[options.plan];
  if (!plan.priceId) {
    throw new Error('This plan does not require payment');
  }

  paddle.Checkout.open({
    items: [{ priceId: plan.priceId, quantity: 1 }],
    customer: options.email ? { email: options.email } : undefined,
    customData: {
      plan: options.plan,
    },
    settings: {
      successUrl: options.successUrl || `${window.location.origin}/dashboard?subscription=success`,
      displayMode: 'overlay',
      theme: 'light',
      locale: 'en',
    },
  });
}

export async function openCustomerPortal(customerId: string): Promise<void> {
  const paddle = await getPaddle();
  if (!paddle) {
    throw new Error('Paddle not initialized');
  }

  // Paddle.js doesn't have a direct portal method
  // Redirect to Paddle's customer portal URL
  // This URL is provided in webhook events or can be constructed
  window.open(`https://customer.paddle.com/subscriptions/${customerId}`, '_blank');
}
