import * as React from "react";
import { z } from "zod";
import { WidgetLayout } from "@/lib/widget";

// type KV = { [key: string]: string };

// Widget config schema during setup.
const widgetConfigSchemaObj = {
  widgetId: z.string(),
  sessionId: z.string().optional(),
};

// Customer schema as API response.
const customerSchemaObj = {
  customerId: z.string(),
  externalId: z.string().nullable(),
  email: z.string().nullable(),
  phone: z.string().nullable(),
  name: z.string(),
  avatarUrl: z.string(),
  isVerified: z.boolean(),
  role: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  requireIdentities: z.array(z.string()),
};

export const customerSchema = z.object(customerSchemaObj);

// Authenticated customer schema properties.
// These attributes along with customer details returned by widget init API.
const customerAuthSchemaObj = {
  jwt: z.string(),
  create: z.boolean(),
};

export const customerAuthSchema = z.object(customerAuthSchemaObj);

// Response schema returned by widget init API.
export const initWidgetResponseSchemaObj = {
  ...customerAuthSchemaObj,
  ...customerSchemaObj,
};

export const initWidgetResponseSchema = z.object(initWidgetResponseSchemaObj);

export type Customer = z.infer<typeof customerSchema>;

export type InitWidgetResponse = z.infer<typeof initWidgetResponseSchema>;

// Widget customer auth schema required for customer widget context.
// Has widget config, init widget response and customer details.
const authenticatedCustomerSchemaObj = {
  ...widgetConfigSchemaObj,
  ...initWidgetResponseSchemaObj,
};

export const authenticatedCustomerAuthSchema = z.object(
  authenticatedCustomerSchemaObj
);

export type AuthenticatedCustomer = z.infer<
  typeof authenticatedCustomerAuthSchema
>;

export interface CustomerRefreshed {
  externalId: string | null;
  email: string | null;
  phone: string | null;
  name: string;
  avatarUrl: string;
  isVerified: boolean;
  role: string;
  requireIdentities: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CustomerContext {
  customer: AuthenticatedCustomer | null;
  widgetLayout: WidgetLayout;
  isLoading: boolean;
  hasError: boolean;
  setUpdates: (updates: CustomerRefreshed) => void;
}

export const CustomerContext = React.createContext<CustomerContext | null>(
  null
);

export const useCustomer = () => {
  const context = React.useContext(CustomerContext);
  if (!context) {
    throw new Error("useCustomer must be used within a CustomerProvider");
  }
  return context;
};
