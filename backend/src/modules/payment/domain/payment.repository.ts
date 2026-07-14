import type { PlanType } from "@prisma/client";

export type PaymentUser = {
  id: string;
  name: string;
  email: string;
};

export type PaymentPlan = {
  id: string;
  name: string;
  type: PlanType;
  price: number;
};

export type CreatePendingPaymentInput = {
  userId: string;
  planId: string;
  amount: number;
  provider: string;
  transactionId: string;
};

export type PendingPayment = {
  id: string;
  transactionId: string | null;
  amount: number;
};

export type PaymentHistoryItem = {
  id: string;
  amount: number;
  status: string;
  provider: string;
  createdAt: Date;
  plan: {
    name: string;
  } | null;
};

export interface PaymentRepository {
  findUserById(userId: string): Promise<PaymentUser | null>;

  findPlanByType(type: PlanType): Promise<PaymentPlan | null>;

  createPending(
    data: CreatePendingPaymentInput,
  ): Promise<PendingPayment>;

  findByUserId(userId: string): Promise<PaymentHistoryItem[]>;
}