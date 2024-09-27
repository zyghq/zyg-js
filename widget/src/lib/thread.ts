import { z } from "zod";

export const createThreadResponseSchema = z.object({
  threadId: z.string(),
  customer: z.object({
    customerId: z.string(),
    name: z.string(), // TODO: add support for avatarUrl
  }),
  title: z.string().optional(),
  description: z.string().optional(),
  status: z.string(),
  replied: z.boolean(),
  priority: z.string(),
  channel: z.string(),
  previewText: z.string(),
  inboundFirstSeqId: z.string(),
  inboundLastSeqId: z.string(),
  inboundCustomer: z.object({
    customerId: z.string(),
    name: z.string(), // TODO: add support for avatarUrl
  }),
  createdAt: z.string(),
  updatedAt: z.string(),
  chat: z.object({
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
  }),
});

export type CreateThreadResponse = z.infer<typeof createThreadResponseSchema>;

export const threadResponseSchema = z.object({
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
});

export type ThreadResponseItem = z.infer<typeof threadResponseSchema>;

export const threadChatResponseSchema = z.object({
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
});

export type ThreadChatResponse = z.infer<typeof threadChatResponseSchema>;
