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
      '2 apps',
      '50 AI replies per month',
      'iOS + Android support',
      'Manual approval only',
    ],
    limits: {
      apps: 2,
      repliesPerMonth: 50,
      teamMembers: 1,
      autoReply: false,
      analytics: false,
    },
  },
  starter: {
    name: 'Starter',
    description: 'For indie developers',
    price: 9,
    priceId: process.env.NEXT_PUBLIC_PADDLE_STARTER_PRICE_ID || '',
    popular: true,
    features: [
      '3 apps',
      '300 AI replies per month',
      'iOS + Android support',
      '4-5 star auto-reply',
      'Basic support',
    ],
    limits: {
      apps: 3,
      repliesPerMonth: 300,
      teamMembers: 1,
      autoReply: true,
      autoReplyMinRating: 4,
      analytics: false,
    },
  },
  pro: {
    name: 'Pro',
    description: 'For growing app businesses',
    price: 29,
    priceId: process.env.NEXT_PUBLIC_PADDLE_PRO_PRICE_ID || '',
    features: [
      '10 apps',
      '2,000 AI replies per month',
      'iOS + Android support',
      'Auto-reply all ratings',
      'Basic analytics',
      '2 team members',
    ],
    limits: {
      apps: 10,
      repliesPerMonth: 2000,
      teamMembers: 2,
      autoReply: true,
      autoReplyMinRating: 1,
      analytics: true,
    },
  },
  studio: {
    name: 'Studio',
    description: 'For agencies and large teams',
    price: 79,
    priceId: process.env.NEXT_PUBLIC_PADDLE_STUDIO_PRICE_ID || '',
    features: [
      '30+ apps',
      '10,000 AI replies per month',
      'iOS + Android support',
      'Auto-reply all ratings',
      'Advanced analytics',
      'Unlimited team members',
      'Priority support',
    ],
    limits: {
      apps: 30,
      repliesPerMonth: 10000,
      teamMembers: -1, // unlimited
      autoReply: true,
      autoReplyMinRating: 1,
      analytics: true,
      advancedAnalytics: true,
      prioritySupport: true,
    },
  },
} as const;

export type PlanType = keyof typeof PLANS;
