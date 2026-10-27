import { AuctionStatus } from "@/enums/auctionStatus";
import type { ItemCondition } from "@/enums/itemCondition";
import type { ShippingType } from "@/enums/shippingType";
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

export type AdminAuctionItemCategory = {
  id: string;
  name: string;
};

export type AdminAuctionItem = {
  id: string;
  title: string;
  description: string;
  itemCondition: ItemCondition;
  startingPrice: string;
  reservePrice: string | null;
  shippingType: ShippingType;
  shippingCost: string | null;
  shippingEstimatedDays: number | null;
  category: AdminAuctionItemCategory;
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

export type AdminAuctionResponse = {
  success: boolean;
  message: string;
  data: AdminAuction;
};

export type AdminAuctionDecision = {
  id: string;
  status: AuctionStatus;
  title: string;
  rejectionReason?: string | null;
};

export type AdminAuctionDecisionResponse = {
  success: boolean;
  message: string;
  data: AdminAuctionDecision;
};
