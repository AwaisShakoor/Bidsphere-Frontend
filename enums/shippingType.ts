export enum ShippingType {
  FREE = "FREE",
  FLAT_RATE = "FLAT_RATE",
}

export const SHIPPING_TYPE_OPTIONS = [
  { value: ShippingType.FREE, label: "Free shipping" },
  { value: ShippingType.FLAT_RATE, label: "Flat rate" },
] as const;
