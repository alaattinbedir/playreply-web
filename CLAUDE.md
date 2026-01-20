# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PlayReply is a SaaS application for AI-powered app review response management. It helps developers respond to Google Play and iOS App Store reviews automatically using AI-generated replies.

## Development Commands

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Build for production
npm run lint     # Run ESLint
npm start        # Start production server
```

## Tech Stack

- **Framework**: Next.js 16 with App Router, React 19, TypeScript (strict mode)
- **Database/Auth**: Supabase (PostgreSQL + Auth with 2FA/TOTP support)
- **UI**: Shadcn/UI (New York style) + Radix UI + Tailwind CSS 4
- **Forms**: React Hook Form + Zod validation
- **Payments**: Paddle (subscription billing)
- **Automation**: n8n workflows for review fetching and reply sending
- **Analytics**: Vercel Analytics + Speed Insights

## Architecture

### Directory Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth routes (login, signup, password reset)
│   ├── (dashboard)/       # Protected routes (dashboard, apps, reviews, settings, analytics)
│   ├── api/               # API routes
│   │   ├── n8n/          # n8n webhook integrations (sync, import)
│   │   └── webhooks/     # External webhooks (Paddle)
│   └── auth/callback/     # OAuth callback handler
├── components/
│   └── ui/                # Shadcn/UI components
└── lib/
    ├── api/               # API utilities (stats, apps, reviews, settings)
    ├── supabase/          # Supabase clients (client.ts, server.ts)
    └── paddle/            # Paddle config and client
```

### Key Patterns

**Supabase Clients**:
- `@/lib/supabase/client` - Browser client for client components
- `@/lib/supabase/server` - Server client for server components and API routes (async function)

**Route Protection**: Middleware (`src/middleware.ts`) protects `/dashboard`, `/apps`, `/reviews`, `/settings` routes and redirects unauthenticated users.

**API Routes**: Next.js route handlers that communicate with n8n webhooks for review operations. The n8n base URL is configured via `N8N_WEBHOOK_BASE_URL` env var.

### Data Flow

1. **Reviews sync**: Frontend triggers `/api/n8n/sync` → n8n webhook fetches from stores → stores in Supabase
2. **Reply generation**: n8n workflows use AI to generate replies → stored as drafts in Supabase
3. **Reply approval**: User approves in UI → n8n workflow sends to store

### External Integrations

- **Google Play**: Shared service account model - users grant "Reply to reviews" permission
- **App Store**: Per-user credentials (Issuer ID, Key ID, Private Key) stored in Supabase
- **n8n**: Webhook-based automation at `N8N_WEBHOOK_BASE_URL`
- **Paddle**: Subscription management with 4 tiers (Free, Starter, Pro, Studio)

## Environment Variables

Required variables (see `.env.local.example`):
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (for webhooks)
- `N8N_WEBHOOK_BASE_URL`
- `NEXT_PUBLIC_PADDLE_*` variables for billing
- `NEXT_PUBLIC_GOOGLE_SERVICE_ACCOUNT_EMAIL`

## Conventions

- Path alias: `@/*` maps to `./src/*`
- Components use Shadcn/UI patterns with `class-variance-authority` for variants
- Forms use React Hook Form with Zod schemas
- Server components are default; use `'use client'` directive only when needed
- Toast notifications via Sonner
