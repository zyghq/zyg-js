import { createFileRoute } from "@tanstack/react-router";
import { CloseButton } from "@/components/widget-buttons";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useStore } from "zustand";
import { useWidgetStore } from "@/components/providers";
import { BottomNavigation } from "@/components/navbar";

export const Route = createFileRoute("/")({
  component: Home,
});

export default function Home() {
  const store = useWidgetStore();
  const links = useStore(store, (state) => state.actions.getHomeLinks(state));
  const title = useStore(store, (state) => state.actions.getWidgetTitle(state));
  const team = useStore(store, (state) => state.actions.getWidgetTeam(state));
  return (
    <div>
      <div className="flex w-full justify-between p-4">
        <div className="flex flex-col">
          <div className="text-md font-normal text-muted-foreground">
            {team}
          </div>
          <div className="text-md font-semibold">{title}</div>
        </div>
        <CloseButton />
      </div>
      <ScrollArea className="h-[calc(100dvh-11rem)] px-4">
        <div className="flex flex-col gap-2">
          {links.map((link) => (
            <a
              target="_blank"
              href={link.href}
              key={link.id}
              className="w-full max-w-md mx-auto flex flex-col gap-4 rounded-lg border"
            >
              <div className="rounded-lg overflow-hidden transition-all duration-300 hover:bg-accent">
                {link.imageUrl && (
                  <img
                    src={link.imageUrl}
                    alt="Product Image"
                    width={300}
                    height={200}
                    className="w-full h-64 object-cover"
                    style={{ aspectRatio: "300/200", objectFit: "cover" }}
                  />
                )}
                <div className="p-4 space-y-1">
                  <div className="flex items-center">
                    <div className="flex items-center font-medium text-sm">
                      {link.title}
                    </div>
                  </div>
                  <div className="text-muted-foreground text-sm line-clamp-6">
                    {link.description}
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </ScrollArea>
      <BottomNavigation />
    </div>
  );
}
