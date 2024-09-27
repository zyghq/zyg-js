import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/threads")({
  component: () => <div>Hello /threads!</div>,
});
