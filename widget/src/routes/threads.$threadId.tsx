import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/threads/$threadId")({
  component: () => <div>Hello /threads/$threadId!</div>,
});
