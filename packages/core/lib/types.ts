import { z } from "zod";
import {
  customerSchema,
  threadSchema,
  threadChatSchema,
  newCustomerThreadSchema,
  widgetConfigSchema,
  homeLinkSchema,
} from "./schemas";

export interface BaseOptions {
  apiUrl?: string;
  headers?: { [key: string]: string };
}

export type Customer = z.infer<typeof customerSchema>;

export type Thread = z.infer<typeof threadSchema>;

export type ThreadChat = z.infer<typeof threadChatSchema>;

export type NewCustomerThreadChat = z.infer<typeof newCustomerThreadSchema>;

export type WidgetConfig = z.infer<typeof widgetConfigSchema>;

export type HomeLink = z.infer<typeof homeLinkSchema>;
