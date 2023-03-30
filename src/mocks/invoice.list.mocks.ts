import { Invoice } from '../interfaces/invoice';

export const FAKE_INVOICE_LIST: Invoice[] = [
  {
    code: '9005f800',
    concept: 'Patatas',
    currency: 'EUR',
    invoiceId: 0,
    amount: 100,
    status: 'PENDING',
  },
  {
    code: '9005fac6',
    concept: 'Lechugas',
    currency: 'EUR',
    invoiceId: 1,
    amount: 30,
    status: 'PENDING',
  },
  {
    code: '9005fc6a',
    concept: 'Tomates',
    currency: 'EUR',
    invoiceId: 2,
    amount: 20,
    status: 'PENDING',
  },
];
