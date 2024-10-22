import { DEFAULT_OPTIONS } from "./constants";
import {
  initWidgetRequest,
  createThreadAPI,
  getThreadChatsAPI,
  sendThreadMessageAPI,
  getThreadMessagesAPI,
  getCustomerAPI,
} from "./apis";
import {
  customerSchema,
  threadSchema,
  threadChatSchema,
  newCustomerThreadSchema,
  widgetConfigSchema,
  homeLinkSchema,
} from "./schemas";

import {
  Customer,
  Thread,
  ThreadChat,
  NewCustomerThreadChat,
  WidgetConfig,
  HomeLink,
} from "./types";

// exports.
export {
  // constants.
  DEFAULT_OPTIONS,
  // schemas
  homeLinkSchema,
  widgetConfigSchema,
  customerSchema,
  threadSchema,
  threadChatSchema,
  newCustomerThreadSchema,
  // APIs.
  initWidgetRequest,
  createThreadAPI,
  getThreadChatsAPI,
  sendThreadMessageAPI,
  getThreadMessagesAPI,
  getCustomerAPI,
};

// types.
export type {
  Customer,
  Thread,
  ThreadChat,
  NewCustomerThreadChat,
  WidgetConfig,
  HomeLink,
};
