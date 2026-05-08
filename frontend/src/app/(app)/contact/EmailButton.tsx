// app/contact/EmailButton.tsx
'use client';

import { Button } from "@/components/ui/button";

export default function EmailButton() {
  return (
    <Button className="w-full" onClick={() => window.open("mailto:support@rentmate.com")}>
      Email Us
    </Button>
  );
}
