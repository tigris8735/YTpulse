'use client';

import { useState, useEffect } from 'react';
import type { User, PaymentRecord } from '@/types';

interface CabinetData {
  user: User | null;
  payments: PaymentRecord[];
}

export function useUser() {
  const [data, setData] = useState<CabinetData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/cabinet')
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return { data, loading };
}
