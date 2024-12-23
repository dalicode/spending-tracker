import type { JsonObject } from "@prisma/client/runtime/library";

export type RegisterForm = {
  username: string;
  password: string;
  registerPass: string;
  config: string;
};

export type CategoryDbType = {
  name: string;
  id?: number;
  user_id: number;
  tombstone?: boolean;
};

export type CategoryForm = {
  name: string;
  id?: number;
  total: string;
};

export type RecurringForm = {
  name: string;
  amount: number;
  isIncome?: boolean;
  tombstone?: boolean;
  id?: number;
};

export type responseType = {
  status: boolean;
  message: string;
  data: string;
};
