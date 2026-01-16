// Paddle Configuration
// Update these values after creating products in Paddle Dashboard

export const PADDLE_CONFIG = {
  // Paddle Environment
  environment: process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT as 'sandbox' | 'production' || 'sandbox',

  // Client-side token (starts with 'test_' for sandbox, 'live_' for production)
  clientToken: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN || '',

  // Webhook secret for verifying webhook signatures
  webhookSecret: process.env.PADDLE_WEBHOOK_SECRET || '',
};

// Plan definitions with Paddle Price IDs
// Update these after creating products in Paddle Dashboard
export const PLANS = {
  free: {
    name: 'Free',
    description: 'Perfect for trying out PlayReply',
    price: 0,
    priceId: null, // Free plan doesn't need a price ID
    features: [
      '1 app',
      '50 AI replies per month',
      'Manual approval only',
      'Email support',
    ],
    limits: {
      apps: 1,
      repliesPerMonth: 50,
      teamMembers: 1,
    },
  },
  starter: {
    name: 'Starter',
    description: 'For indie developers and small teams',
    price: 29,
    priceId: process.env.NEXT_PUBLIC_PADDLE_STARTER_PRICE_ID || '',
    features: [
      '3 apps',
      '500 AI replies per month',
      'Auto-reply for 4-5 star reviews',
      'Priority email support',
      'Reply analytics',
    ],
    limits: {
      apps: 3,
      repliesPerMonth: 500,
      teamMembers: 1,
    },
  },
  pro: {
    name: 'Pro',
    description: 'For growing app businesses',
    price: 99,
    priceId: process.env.NEXT_PUBLIC_PADDLE_PRO_PRICE_ID || '',
    popular: true,
    features: [
      '10 apps',
      '2,000 AI replies per month',
      'Auto-reply for all ratings',
      'Team access (3 members)',
      'Advanced analytics',
      'Priority support',
      'Custom reply templates',
    ],
    limits: {
      apps: 10,
      repliesPerMonth: 2000,
      teamMembers: 3,
    },
  },
} as const;

export type PlanType = keyof typeof PLANS;
