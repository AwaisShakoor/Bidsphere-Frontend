export type Auction = {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  status: string;
  rejectionReason: string | null;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
};

export type CreateAuctionRequest = {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
};

export type UpdateAuctionRequest = {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
};

export type CreateAuctionResponse = {
  message: string;
  auction: Auction;
};

export type UpdateAuctionResponse = {
  message: string;
  auction: Auction;
};

export type DeleteAuctionResponse = {
  message: string;
};

export type AuctionsResponse = {
  message: string;
  auctions: Auction[];
};

export type AuctionResponse = {
  message: string;
  auction: Auction;
};
