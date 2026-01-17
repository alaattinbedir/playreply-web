'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import { useCheckout } from "@/components/paddle-provider";
import { useState } from "react";

export function PricingSection() {
  const { startCheckout, isLoading } = useCheckout();
  const [checkoutPlan, setCheckoutPlan] = useState<string | null>(null);

  const handleCheckout = async (plan: 'starter' | 'pro' | 'studio') => {
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

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4 max-w-7xl mx-auto">
          {/* Free Plan */}
          <Card className="relative hover:border-muted-foreground/30 transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="pb-6">
              <CardTitle className="text-xl">Free</CardTitle>
              <CardDescription>For trying out</CardDescription>
              <div className="pt-4">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3 text-sm">
                {[
                  { text: "2 apps", included: true },
                  { text: "50 AI replies/month", included: true },
                  { text: "iOS + Android", included: true },
                  { text: "Auto-reply", included: false },
                  { text: "Analytics", included: false },
                  { text: "Team members", included: false },
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    {feature.included ? (
                      <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Check className="h-3 w-3 text-primary" />
                      </div>
                    ) : (
                      <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                        <X className="h-3 w-3 text-muted-foreground" />
                      </div>
                    )}
                    <span className={feature.included ? "text-muted-foreground" : "text-muted-foreground/50"}>
                      {feature.text}
                    </span>
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
          <Card className="relative border-primary shadow-xl shadow-primary/10 scale-[1.02] z-10">
            <div className="absolute -top-4 left-0 right-0 flex justify-center">
              <Badge className="px-4 py-1 shadow-lg">Most Popular</Badge>
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent rounded-lg" />
            <CardHeader className="relative pb-6">
              <CardTitle className="text-xl">Starter</CardTitle>
              <CardDescription>For indie developers</CardDescription>
              <div className="pt-4">
                <span className="text-4xl font-bold">$9</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent className="relative space-y-4">
              <ul className="space-y-3 text-sm">
                {[
                  { text: "4 apps", included: true },
                  { text: "500 AI replies/month", included: true },
                  { text: "iOS + Android", included: true },
                  { text: "4-5 star auto-reply", included: true },
                  { text: "Analytics", included: false },
                  { text: "Team members", included: false },
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    {feature.included ? (
                      <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <Check className="h-3 w-3 text-primary" />
                      </div>
                    ) : (
                      <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                        <X className="h-3 w-3 text-muted-foreground" />
                      </div>
                    )}
                    <span className={feature.included ? "" : "text-muted-foreground/50"}>
                      {feature.text}
                    </span>
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
            <CardHeader className="pb-6">
              <CardTitle className="text-xl">Pro</CardTitle>
              <CardDescription>For growing businesses</CardDescription>
              <div className="pt-4">
                <span className="text-4xl font-bold">$29</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3 text-sm">
                {[
                  { text: "12 apps", included: true },
                  { text: "3,000 AI replies/month", included: true },
                  { text: "iOS + Android", included: true },
                  { text: "All ratings auto-reply", included: true },
                  { text: "Basic analytics", included: true },
                  { text: "2 team members", included: true },
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                    <span className="text-muted-foreground">{feature.text}</span>
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

          {/* Studio Plan */}
          <Card className="relative hover:border-muted-foreground/30 transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="pb-6">
              <CardTitle className="text-xl">Studio</CardTitle>
              <CardDescription>For agencies</CardDescription>
              <div className="pt-4">
                <span className="text-4xl font-bold">$79</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3 text-sm">
                {[
                  { text: "30+ apps", included: true },
                  { text: "10,000 AI replies/month", included: true },
                  { text: "iOS + Android", included: true },
                  { text: "All ratings auto-reply", included: true },
                  { text: "Advanced analytics", included: true },
                  { text: "Unlimited team", included: true },
                  { text: "Priority support", included: true },
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                    <span className="text-muted-foreground">{feature.text}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full h-11"
                onClick={() => handleCheckout('studio')}
                disabled={isLoading || checkoutPlan === 'studio'}
              >
                {checkoutPlan === 'studio' ? 'Loading...' : 'Contact Sales'}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="text-center space-y-2">
          <p className="text-muted-foreground">
            All plans include a 7-day free trial. No credit card required to start.
          </p>
          <p className="text-sm text-muted-foreground">
            Need a custom plan? <Link href="/contact" className="text-primary hover:underline font-medium">Contact us</Link>
          </p>
        </div>
      </div>
    </section>
  );
}
