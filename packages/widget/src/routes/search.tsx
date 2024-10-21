import { createFileRoute } from "@tanstack/react-router";
import { HomeButton, CloseButton } from "@/components/widget-buttons";
import { SendMessageButton } from "@/components/widget-buttons";

export const Route = createFileRoute("/search")({
  component: Search,
});

function Search() {
  return (
    <div className="flex min-h-screen flex-col font-sans">
      <div className="z-10 w-full justify-between">
        <div className="flex items-center justify-start py-4 border-b px-4 gap-1">
          <HomeButton />
          <div className="flex-1">
            <div className="text-muted-foreground text-sm">
              Search for articles, help docs and more...
            </div>
          </div>
          <CloseButton />
        </div>
        <div className="fixed bottom-0 left-0 flex w-full flex-col">
          <div className="w-full px-4 py-2 flex justify-center">
            <SendMessageButton ctaText={"Send us a message"} />
          </div>
          <div className="w-full border-t flex justify-center items-center py-2">
            <a
              href="https://www.zyg.ai/"
              className="text-xs font-semibold text-muted-foreground"
              target="_blank"
            >
              Powered by Zyg
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
