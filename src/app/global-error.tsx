"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center space-y-4 p-8">
            <h1 className="text-4xl font-bold">Something went wrong!</h1>
            <p className="text-muted-foreground">
              We've been notified and are working on a fix.
            </p>
            <Button onClick={() => reset()}>Try again</Button>
          </div>
        </div>
      </body>
    </html>
  );
}
