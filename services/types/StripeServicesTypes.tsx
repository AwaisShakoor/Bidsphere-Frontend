export type StripeConnectionStatus = {
  connected: boolean;
  payoutEnabled: boolean;
  chargesEnabled: boolean;
  stripeAccountId: string | null;
};

export type StripeStatusResponse = {
  message: string;
  result: StripeConnectionStatus;
};

export type StripeConnectResult = {
  url: string;
  stripeAccountId: string;
};

export type StripeConnectResponse = {
  message: string;
  result: StripeConnectResult;
};

export type StripeBalance = {
  currency: string;
  available: number;
  pending: number;
};

export type StripeBalanceResponse = {
  message: string;
  result: StripeBalance;
};

export type StripeWithdrawResult = {
  payoutId: string;
  amount: number;
  currency: string;
  status: string;
  arrivalDate: string;
};

export type StripeWithdrawResponse = {
  message: string;
  result: StripeWithdrawResult;
};
