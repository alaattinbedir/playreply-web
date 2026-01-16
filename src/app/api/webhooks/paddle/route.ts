import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Paddle webhook secret for signature verification
const webhookSecret = process.env.PADDLE_WEBHOOK_SECRET || '';

// Create admin client for webhook operations
function getSupabaseAdmin() {
  return createClient(supabaseUrl, supabaseServiceKey);
}

// Verify Paddle webhook signature
function verifySignature(payload: string, signature: string): boolean {
  if (!webhookSecret) {
    console.warn('PADDLE_WEBHOOK_SECRET not configured, skipping verification');
    return true; // Allow in development
  }

  const parts = signature.split(';');
  const tsValue = parts.find(p => p.startsWith('ts='))?.split('=')[1];
  const h1Value = parts.find(p => p.startsWith('h1='))?.split('=')[1];

  if (!tsValue || !h1Value) {
    return false;
  }

  const signedPayload = `${tsValue}:${payload}`;
  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(signedPayload)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(h1Value),
    Buffer.from(expectedSignature)
  );
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.text();
    const signature = request.headers.get('paddle-signature') || '';

    // Verify signature in production
    if (process.env.NODE_ENV === 'production' && !verifySignature(payload, signature)) {
      console.error('Invalid Paddle webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event = JSON.parse(payload);
    const eventType = event.event_type;

    console.log('Paddle webhook received:', eventType);

    const supabase = getSupabaseAdmin();

    switch (eventType) {
      case 'subscription.created':
      case 'subscription.activated': {
        const { subscription_id, customer_id, items, custom_data, status } = event.data;
        const plan = custom_data?.plan || 'starter';

        // Find or create organization for this customer
        const { data: org, error: orgError } = await supabase
          .from('organizations')
          .upsert({
            paddle_customer_id: customer_id,
            paddle_subscription_id: subscription_id,
            plan: plan,
            subscription_status: status,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'paddle_customer_id',
          })
          .select()
          .single();

        if (orgError) {
          console.error('Error updating organization:', orgError);
        }

        // Log billing event
        await supabase.from('billing_events').insert({
          org_id: org?.id,
          paddle_event_id: event.event_id,
          event_type: eventType,
          amount: items?.[0]?.price?.unit_price?.amount || 0,
          currency: items?.[0]?.price?.unit_price?.currency_code || 'USD',
        });

        break;
      }

      case 'subscription.updated': {
        const { subscription_id, status, items, custom_data } = event.data;
        const plan = custom_data?.plan;

        await supabase
          .from('organizations')
          .update({
            subscription_status: status,
            ...(plan && { plan }),
            updated_at: new Date().toISOString(),
          })
          .eq('paddle_subscription_id', subscription_id);

        break;
      }

      case 'subscription.canceled':
      case 'subscription.past_due': {
        const { subscription_id, status } = event.data;

        await supabase
          .from('organizations')
          .update({
            subscription_status: status,
            updated_at: new Date().toISOString(),
          })
          .eq('paddle_subscription_id', subscription_id);

        break;
      }

      case 'transaction.completed': {
        const { id, customer_id, details, custom_data } = event.data;

        // Find organization
        const { data: org } = await supabase
          .from('organizations')
          .select('id')
          .eq('paddle_customer_id', customer_id)
          .single();

        if (org) {
          await supabase.from('billing_events').insert({
            org_id: org.id,
            paddle_event_id: event.event_id,
            event_type: eventType,
            amount: details?.totals?.total || 0,
            currency: details?.totals?.currency_code || 'USD',
          });
        }

        break;
      }

      default:
        console.log('Unhandled Paddle event:', eventType);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Paddle webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
