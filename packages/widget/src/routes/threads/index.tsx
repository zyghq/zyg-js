import { createFileRoute } from "@tanstack/react-router";
import { Icons } from "@/components/icons";
import { SendMessageButton } from "@/components/widget-buttons";
import { BottomNavigation } from "@/components/navbar";
import { CloseButton } from "@/components/widget-buttons";
import { useStore } from "zustand";
import { useWidgetStore } from "@/components/providers";
import { useQuery } from "@tanstack/react-query";
import { getThreadChatsAPI } from "@zyg-js/core";
import { Threads } from "@/components/threads";
import { ScrollArea } from "@/components/ui/scroll-area";

export const Route = createFileRoute("/threads/")({
  component: ThreadList,
});

function ThreadList() {
  const store = useWidgetStore();
  const team = useStore(store, (state) => state.actions.getWidgetTeam(state));
  const widgetId = useStore(store, (state) => state.actions.getWidgetId(state));
  const jwt = useStore(store, (state) => state.actions.getAuthToken(state));

  const {
    data: threads,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["threads"],
    queryFn: async () => {
      const { data, error } = await getThreadChatsAPI(widgetId, jwt);
      if (error) {
        throw new Error(error.message);
      }
      if (data) return data;
      return null;
    },
  });

  const renderThreads = () => {
    if (error) {
      return (
        <div className="w-full flex items-center justify-center mt-24">
          <div className="flex flex-col items-center justify-center text-muted-foreground">
            <span className="text-lg">{`We're sorry, something went wrong.`}</span>
            <span className="text-lg">Please try again later.</span>
          </div>
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="w-full flex items-center justify-center">
          <div className="flex flex-col items-center justify-center">
            <svg
              className="animate-spin h-5 w-5 text-muted-foreground"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        </div>
      );
    }

    if (threads && threads.length) {
      return (
        <>
          <Threads threads={threads} />
        </>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center">
        <div className="mt-32 space-y-4">
          <Icons.nothing className="w-40" />
          <p className="text-center text-muted-foreground">No threads yet.</p>
          <SendMessageButton ctaText={"Send us a Message"} />
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="flex w-full justify-between p-4">
        <div className="flex flex-col">
          <div className="text-md font-normal text-muted-foreground">
            {team}
          </div>
          <div className="text-md font-semibold">Threads</div>
        </div>
        <CloseButton />
      </div>
      <ScrollArea className="h-[calc(100dvh-13rem)] px-4">
        {renderThreads()}
      </ScrollArea>
      <div className="flex flex-col items-center mt-4">
        <SendMessageButton ctaText={"Send us a new Message"} />
      </div>
      <div className="flex justify-center items-center"></div>
      <BottomNavigation />
    </div>
  );
}
