'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { useCheckout } from "@/components/paddle-provider";
import { useState } from "react";

export function PricingSection() {
  const { startCheckout, isLoading } = useCheckout();
  const [checkoutPlan, setCheckoutPlan] = useState<string | null>(null);

  const handleCheckout = async (plan: 'starter' | 'pro') => {
    setCheckoutPlan(plan);
    try {
      await startCheckout(plan);
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setCheckoutPlan(null);
    }
  };

  return (
    <section id="pricing" className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />

      <div className="container relative space-y-16">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <Badge variant="outline" className="mb-4">Pricing</Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            Simple, <span className="text-primary">Transparent</span> Pricing
          </h2>
          <p className="text-lg text-muted-foreground">
            Start free, upgrade when you need more. No hidden fees, cancel anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {/* Free Plan */}
          <Card className="relative hover:border-muted-foreground/30 transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="pb-8">
              <CardTitle className="text-xl">Free</CardTitle>
              <CardDescription>Perfect for trying out</CardDescription>
              <div className="pt-4">
                <span className="text-5xl font-bold">$0</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {["2 apps", "50 AI replies/month", "Manual approval only", "Basic analytics", "Community support"].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Link href="/signup" className="w-full">
                <Button variant="outline" className="w-full h-11">Get Started</Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Starter Plan - Popular */}
          <Card className="relative border-primary shadow-xl shadow-primary/10 scale-105 z-10">
            <div className="absolute -top-4 left-0 right-0 flex justify-center">
              <Badge className="px-4 py-1 shadow-lg">Most Popular</Badge>
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent rounded-lg" />
            <CardHeader className="relative pb-8">
              <CardTitle className="text-xl">Starter</CardTitle>
              <CardDescription>For growing apps</CardDescription>
              <div className="pt-4">
                <span className="text-5xl font-bold">$29</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent className="relative space-y-4">
              <ul className="space-y-3">
                {["6 apps", "1,500 AI replies/month", "Auto-approval rules", "Review classification", "Email support", "Priority queue"].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="relative">
              <Button
                className="w-full h-11 shadow-lg shadow-primary/25"
                onClick={() => handleCheckout('starter')}
                disabled={isLoading || checkoutPlan === 'starter'}
              >
                {checkoutPlan === 'starter' ? 'Loading...' : 'Start Free Trial'}
              </Button>
            </CardFooter>
          </Card>

          {/* Pro Plan */}
          <Card className="relative hover:border-muted-foreground/30 transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="pb-8">
              <CardTitle className="text-xl">Pro</CardTitle>
              <CardDescription>For teams & agencies</CardDescription>
              <div className="pt-4">
                <span className="text-5xl font-bold">$99</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {["20 apps", "10,000 AI replies/month", "Team members (3 seats)", "Advanced analytics", "Priority support", "Custom templates"].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full h-11"
                onClick={() => handleCheckout('pro')}
                disabled={isLoading || checkoutPlan === 'pro'}
              >
                {checkoutPlan === 'pro' ? 'Loading...' : 'Start Free Trial'}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="text-center">
          <p className="text-muted-foreground">
            Need more? <Link href="/contact" className="text-primary hover:underline font-medium">Contact us</Link> for Enterprise pricing.
          </p>
        </div>
      </div>
    </section>
  );
}
