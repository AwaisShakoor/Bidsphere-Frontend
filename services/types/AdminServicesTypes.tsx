import { AuctionStatus } from "@/enums/auctionStatus";
import { UserRole } from "@/enums/userRole";

export type AdminUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt: string;
};

export type AdminUsersResponse = {
  success: boolean;
  message: string;
  data: AdminUser[];
};

export type AdminAuctionSeller = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

export type AdminAuctionItemImage = {
  id: string;
  url: string;
};

export type AdminAuctionItem = {
  id: string;
  title: string;
  startingPrice: string;
  images: AdminAuctionItemImage[];
};

export type AdminAuction = {
  id: string;
  status: AuctionStatus;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  rejectionReason: string | null;
  createdAt: string;
  seller: AdminAuctionSeller;
  items: AdminAuctionItem[];
};

export type AdminAuctionsResponse = {
  success: boolean;
  message: string;
  data: AdminAuction[];
};
