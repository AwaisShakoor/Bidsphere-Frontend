export type SellerPayout = {
  id: string;
  amount: string;
  platformFee: string;
  sellerPayout: string;
  currency: string;
  status: string;
  stripeTransferId: string | null;
  paidAt: string | null;
  createdAt: string;
  item: {
    id: string;
    title: string;
  };
  auction: {
    id: string;
    title: string;
  };
  buyer: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
};

export type MyPayoutsResponse = {
  payouts: SellerPayout[];
};
