import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

export function WidgetContainer({
  children,
  config,
}: {
  children: React.ReactNode;
  config: { widgetId: string };
}) {
  console.log("config ->", config);
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
