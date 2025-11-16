'use client';

import React, { useState } from 'react';
import { GreetingCard } from './GreetingCard';

type CardEntry = {
  id: string;
  name?: string | null;
  message?: string | null;
  image?: string | null;
  audio?: string | null;
  timestamp?: string;
} | null;

export function ClientGreetingWrapper({ card }: { card: CardEntry }) {
  const [envelopeState, setEnvelopeState] = useState(0);
  const handleEnvelopeTap = () => {
    setEnvelopeState((prev) => {
      if (prev === 2) return 0;
      return prev + 1;
    });
  };

  return (
    <GreetingCard
      state={envelopeState}
      onTap={handleEnvelopeTap}
      card={card ?? undefined}
    />
  );
}

export default ClientGreetingWrapper;
