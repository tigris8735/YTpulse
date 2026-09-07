import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const SHOP_ID = process.env.YOOKASSA_SHOP_ID;
const SECRET_KEY = process.env.YOOKASSA_SECRET_KEY;
const RETURN_URL = process.env.YOOKASSA_RETURN_URL || 'http://localhost:3000/payments/success';

export interface PaymentCreateResponse {
  id: string;
  confirmation_url: string;
  status: string;
}

export async function createPayment(
  amount: number,
  term: string,
  userId: string
): Promise<PaymentCreateResponse | null> {
  if (!SHOP_ID || !SECRET_KEY) {
    console.warn('[Payment] Yookassa credentials not set');
    return null;
  }

  const idempotenceKey = uuidv4();
  const description = `YT Pulse Pro — ${term}`;

  try {
    const res = await axios.post(
      'https://api.yookassa.ru/v3/payments',
      {
        amount: { value: (amount / 100).toFixed(2), currency: 'RUB' },
        capture: true,
        confirmation: { type: 'redirect', return_url: RETURN_URL },
        description,
        metadata: { userId, term },
      },
      {
        auth: { username: SHOP_ID, password: SECRET_KEY },
        headers: { 'Idempotence-Key': idempotenceKey },
        timeout: 15000,
      }
    );

    return {
      id: res.data.id,
      confirmation_url: res.data.confirmation.confirmation_url,
      status: res.data.status,
    };
  } catch (err) {
    console.error('[Payment] Creation error:', err);
    return null;
  }
}

export async function getPayment(paymentId: string) {
  if (!SHOP_ID || !SECRET_KEY) return null;
  try {
    const res = await axios.get(`https://api.yookassa.ru/v3/payments/${paymentId}`, {
      auth: { username: SHOP_ID, password: SECRET_KEY },
      timeout: 10000,
    });
    return res.data;
  } catch (err) {
    console.error('[Payment] Get error:', err);
    return null;
  }
}
