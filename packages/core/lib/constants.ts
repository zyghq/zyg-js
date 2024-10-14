import type { BaseOptions } from "./types";

export const DEFAULT_OPTIONS = {
  apiUrl: "http://localhost:8000",
} satisfies BaseOptions;

export type { BaseOptions };

export function fromConstant(name: string): string {
  return `hello, ${name}!`;
}
