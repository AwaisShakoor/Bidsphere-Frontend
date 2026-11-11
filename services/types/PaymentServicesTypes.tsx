import type { PaymentStatus } from "@/enums/paymentStatus";

export type Payment = {
  id: string;
  auctionId: string;
  itemId: string;
  buyerId: string;
  sellerId: string;
  amount: string;
  platformFee: string;
  sellerPayout: string;
  currency: string;
  stripePaymentIntentId: string;
  stripeTransferId: string | null;
  status: PaymentStatus | string;
  refundAmount: string | null;
  refundReason: string | null;
  refundedAt: string | null;
  paymentDeadline: string;
  runnerUpNotified: boolean;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
  item?: {
    id: string;
    title: string;
  };
  auction?: {
    id: string;
    title: string;
  };
};

export type CreateCheckoutResponse = {
  payment: Payment;
  url: string;
};

export type ItemPaymentResponse = {
  payment: Payment;
};

export type MyPaymentsResponse = {
  payments: Payment[];
};
