import { PaymentStatus } from "@/enums/paymentStatus";
import type { Payment } from "@/services/types/PaymentServicesTypes";

export type PaymentTab = "unpaid" | "paid";

export const PAYMENT_TABS: {
  value: PaymentTab;
  label: string;
  empty: string;
}[] = [
  { value: "paid", label: "Paid", empty: "No paid payments yet." },
  { value: "unpaid", label: "Unpaid", empty: "No unpaid payments right now." },
];

export function getPaymentsByTab(payments: Payment[], tab: PaymentTab) {
  const status =
    tab === "unpaid" ? PaymentStatus.PENDING : PaymentStatus.COMPLETED;
  return payments.filter((payment) => payment.status === status);
}

export function getPaymentTabEmptyMessage(tab: PaymentTab) {
  return PAYMENT_TABS.find((tabItem) => tabItem.value === tab)?.empty ?? "";
}
