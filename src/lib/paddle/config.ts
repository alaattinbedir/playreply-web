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

// Billing interval type
export type BillingInterval = 'monthly' | 'yearly';

// Yearly discount percentage (4 months free = ~33%)
export const YEARLY_DISCOUNT_PERCENT = 33;

// Marketing message for yearly plans
export const YEARLY_DISCOUNT_MESSAGE = '4 months FREE';

// Plan definitions with Paddle Price IDs
// Update these after creating products in Paddle Dashboard
export const PLANS = {
  free: {
    name: 'Free',
    description: 'Perfect for trying out PlayReply',
    pricing: {
      monthly: {
        price: 0,
        priceId: null, // Free plan doesn't need a price ID
      },
      yearly: {
        price: 0,
        priceId: null,
        monthlyEquivalent: 0,
      },
    },
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
    popular: true,
    pricing: {
      monthly: {
        price: 9,
        priceId: process.env.NEXT_PUBLIC_PADDLE_STARTER_PRICE_ID || '',
      },
      yearly: {
        price: 69, // $9 × 8 months (4 months free) - rounded
        priceId: process.env.NEXT_PUBLIC_PADDLE_STARTER_YEARLY_PRICE_ID || '',
        monthlyEquivalent: 5.75,
      },
    },
    features: [
      '4 apps',
      '500 AI replies per month',
      'iOS + Android support',
      '4-5 star auto-reply',
      'Basic support',
    ],
    limits: {
      apps: 4,
      repliesPerMonth: 500,
      teamMembers: 1,
      autoReply: true,
      autoReplyMinRating: 4,
      analytics: false,
    },
  },
  pro: {
    name: 'Pro',
    description: 'For growing app businesses',
    pricing: {
      monthly: {
        price: 29,
        priceId: process.env.NEXT_PUBLIC_PADDLE_PRO_PRICE_ID || '',
      },
      yearly: {
        price: 229, // $29 × 8 months (4 months free) - rounded
        priceId: process.env.NEXT_PUBLIC_PADDLE_PRO_YEARLY_PRICE_ID || '',
        monthlyEquivalent: 19,
      },
    },
    features: [
      '12 apps',
      '3,000 AI replies per month',
      'iOS + Android support',
      'Auto-reply all ratings',
      'Basic analytics',
      '2 team members',
    ],
    limits: {
      apps: 12,
      repliesPerMonth: 3000,
      teamMembers: 2,
      autoReply: true,
      autoReplyMinRating: 1,
      analytics: true,
    },
  },
  studio: {
    name: 'Studio',
    description: 'For agencies and large teams',
    pricing: {
      monthly: {
        price: 79,
        priceId: process.env.NEXT_PUBLIC_PADDLE_STUDIO_PRICE_ID || '',
      },
      yearly: {
        price: 629, // $79 × 8 months (4 months free) - rounded
        priceId: process.env.NEXT_PUBLIC_PADDLE_STUDIO_YEARLY_PRICE_ID || '',
        monthlyEquivalent: 52,
      },
    },
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

// Helper to get price for a plan and interval
export function getPlanPrice(plan: PlanType, interval: BillingInterval) {
  const planData = PLANS[plan];
  return planData.pricing[interval];
}
