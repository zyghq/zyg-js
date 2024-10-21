import { z } from "zod";

// Represents schema for home links in widget config.
export const homeLinkSchema = z.object({
  id: z.union([z.string(), z.number()]),
  title: z.string(),
  description: z.string().optional(),
  href: z.string(),
  imageUrl: z.string().optional(),
});

// Represents schema for widget config.
export const widgetConfigSchema = z.object({
  widgetId: z.string(),
  sessionId: z.string().optional(),
  customer: z
    .object({
      email: z.string().optional(),
      externalId: z.string().optional(),
      customerHash: z.string().optional(),
      name: z.string().optional(),
      lastName: z.string().optional(),
      firstName: z.string().optional(),
    })
    .optional(),
  layout: z
    .object({
      title: z.string().default(""),
      team: z.string().default(""),
      tabs: z.array(z.string()).default(["home", "conversations", "search"]),
      homeLinks: z.array(homeLinkSchema).default([]),
    })
    .default({
      title: "Hey! How can we help?",
      team: "Zyg Support",
      tabs: ["home", "conversations", "search"],
      homeLinks: [],
    }),
});

// Represents schema object for customer response from API.
export const customerSchemaObj = {
  customerId: z.string(),
  externalId: z.string().nullable(),
  email: z.string().nullable(),
  isEmailVerified: z.boolean().default(false),
  isEmailPrimary: z.boolean().default(false),
  phone: z.string().nullable(),
  name: z.string(),
  avatarUrl: z.string(),
  role: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
};

// Represents customer schema.
export const customerSchema = z.object(customerSchemaObj);

// Represents thread schema object.
export const threadSchemaObj = {
  threadId: z.string(),
  customer: z.object({
    customerId: z.string(),
    name: z.string(), // TODO: add support for avatarUrl
  }),
  title: z.string(),
  description: z.string(),
  status: z.string(),
  replied: z.boolean(),
  priority: z.string(),
  channel: z.string(),
  previewText: z.string(),
  assignee: z
    .object({
      memberId: z.string(),
      name: z.string(), // TODO: add support for avatarUrl
    })
    .nullable()
    .default(null),
  inboundFirstSeqId: z.string().nullable().default(null),
  inboundLastSeqId: z.string().nullable().default(null),
  inboundCustomer: z
    .object({
      customerId: z.string(),
      name: z.string(),
    })
    .nullable()
    .default(null),
  outboundFirstSeqId: z.string().nullable().default(null),
  outboundLastSeqId: z.string().nullable().default(null),
  outboundMember: z
    .object({
      memberId: z.string(),
      name: z.string(),
    })
    .nullable()
    .default(null),
  createdAt: z.string(),
  updatedAt: z.string(),
};

// Represents the customer thread chat schema object.
export const customerChatSchemaObj = {
  threadId: z.string(),
  chatId: z.string(),
  body: z.string(),
  sequence: z.number(),
  isHead: z.boolean(),
  customer: z.object({
    customerId: z.string(),
    name: z.string(),
  }),
  createdAt: z.string(),
  updatedAt: z.string(),
};

// Represents the thread response schema object.
export const threadSchema = z.object(threadSchemaObj);

// Represents customer thread chat schema.
export const customerChatSchema = z.object(customerChatSchemaObj);

// Represents the new customer thread schema object.
// Combines `threadSchemaObj` and `customerChatSchemaObj`.
export const newCustomerThreadSchemaObj = {
  ...threadSchemaObj,
  ...customerChatSchemaObj,
};

// Represents the new customer thread schema.
export const newCustomerThreadSchema = z.object(newCustomerThreadSchemaObj);

// Represents thread chat schema object.
export const threadChatSchemaObj = {
  threadId: z.string(),
  chatId: z.string(),
  body: z.string(),
  sequence: z.number(),
  customer: z
    .object({
      customerId: z.string(),
      name: z.string(),
    })
    .nullable()
    .default(null),
  member: z
    .object({
      memberId: z.string(),
      name: z.string(),
    })
    .nullable()
    .default(null),
  isHead: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
};

// Represents thread chat schema.
export const threadChatSchema = z.object(threadChatSchemaObj);
