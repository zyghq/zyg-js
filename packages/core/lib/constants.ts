import type { BaseOptions } from "./types";

const DEFAULT_API_URL =
  import.meta.env.VITE_ZYG_XAPI_URL || "http://localhost:8000";

export const DEFAULT_OPTIONS = {
  apiUrl: DEFAULT_API_URL,
} satisfies BaseOptions;

export type { BaseOptions };
