import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { CloseButton, ThreadListButton } from "@/components/widget-buttons";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Icons } from "@/components/icons";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getThreadMessagesAPI, ThreadChat } from "@zyg-js/core";
import { useStore } from "zustand";
import { useWidgetStore } from "@/components/providers";
import { MessageThreadForm } from "@/components/forms";

export const Route = createFileRoute("/threads/$threadId")({
  component: ThreadChats,
});

function Chat({ chat }: { chat: ThreadChat }) {
  const { createdAt } = chat;
  const when = formatDistanceToNow(new Date(createdAt), {
    addSuffix: true,
  });

  const memberId = chat?.member?.memberId || "";
  const memberName = chat?.member?.name || "";
  const customerId = chat?.customer?.customerId || "";
  const isMe = chat.customer?.customerId || null;

  return (
    <div className="flex">
      <div className={`flex ${isMe ? "ml-auto" : "mr-auto"}`}>
        <div className="flex space-x-1">
          {isMe ? (
            <div className="flex items-start gap-1">
              <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                <div className="text-xs text-muted-foreground">{"You"}</div>
                <p className="text-sm">{chat.body}</p>
                <div className="flex text-xs justify-end text-muted-foreground mt-1">
                  {when}
                </div>
              </div>
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={`https://avatar.vercel.sh/${customerId}?w=32&h=32`}
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
          ) : (
            <div className="flex items-start gap-1">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={`https://avatar.vercel.sh/${memberId}?w=32&h=32`}
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                <div className="text-xs text-muted-foreground">{`${
                  isMe ? "You" : memberName
                }`}</div>
                <p className="text-sm">{chat.body}</p>
                <div className="flex text-xs justify-end text-muted-foreground mt-1">
                  {when}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ThreadChats() {
  const { threadId } = Route.useParams();
  const store = useWidgetStore();
  const team = useStore(store, (state) => state.actions.getWidgetTeam(state));
  const widgetId = useStore(store, (state) => state.actions.getWidgetId(state));
  const jwt = useStore(store, (state) => state.actions.getAuthToken(state));

  const {
    data: chats,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["messages", threadId],
    queryFn: async () => {
      const { data, error } = await getThreadMessagesAPI(
        widgetId,
        threadId,
        jwt
      );

      if (error) {
        throw new Error("Error getting thread messages");
      }

      if (data) return data;
      return null;
    },
  });

  const bottomRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

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
      <div className="absolute z-10 h-full w-full flex items-center justify-center">
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

  if (!chats || !chats?.length) {
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="mt-32 space-y-4">
          <Icons.nothing className="w-40" />
          <p className="text-center text-muted-foreground">No threads yet.</p>
        </div>
      </div>
    );
  }

  const reverse = function (arr: ThreadChat[]) {
    const newArr = [];
    let i = arr.length;
    while (i--) {
      newArr.push(arr[i]);
    }
    return newArr;
  };

  const chatsReversed = reverse(chats);

  return (
    <div>
      <div className="flex w-full justify-between p-4">
        <div className="flex gap-1 items-center">
          <ThreadListButton />
          <div className="flex flex-col">
            <div className="font-semibold">{team}</div>
            <div className="text-xs text-muted-foreground">
              Ask us anything, or share your feedback.
            </div>
          </div>
        </div>
        <CloseButton />
      </div>
      <ScrollArea className="px-4 h-[calc(100dvh-14rem)]">
        <div className="space-y-2">
          {chatsReversed.map((chat) => (
            <Chat key={chat.chatId} chat={chat} />
          ))}
          <div ref={bottomRef}></div>
        </div>
      </ScrollArea>
      <div className="fixed bottom-0 left-0 flex w-full flex-col px-4">
        <MessageThreadForm
          disabled={false}
          widgetId={widgetId}
          threadId={threadId}
          jwt={jwt}
          refetch={refetch}
        />
        <div className="w-full flex justify-center items-center py-2">
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

    // <div className="flex min-h-screen flex-col font-sans">
    //   <div className="z-10 w-full justify-between">
    //     <div className="flex items-center justify-start py-4 border-b px-4 gap-1">
    //       <ThreadListButton />
    //       <div>
    //         <div className="flex flex-col">
    //           <div className="font-semibold">Zyg Team</div>
    //           <div className="text-xs text-muted-foreground">
    //             Ask us anything, or share your feedback.
    //           </div>
    //         </div>
    //       </div>
    //       <div className="ml-auto">
    //         <CloseButton />
    //       </div>
    //     </div>
    //     <div className="fixed bottom-0 left-0 flex w-full flex-col px-4">
    //       <MessageThreadForm
    //         disabled={false}
    //         widgetId={widgetId}
    //         threadId={threadId}
    //         jwt={jwt}
    //         refetch={refetch}
    //       />
    //       <div className="w-full flex justify-center items-center py-2">
    //         <a
    //           href="https://www.zyg.ai/"
    //           className="text-xs font-semibold text-muted-foreground"
    //           target="_blank"
    //         >
    //           Powered by Zyg
    //         </a>
    //       </div>
    //     </div>
    //   </div>
    //   <main>
    //     <ScrollArea className="p-4 h-[calc(100dvh-12rem)]">
    //       <div className="space-y-2">
    //         {chatsReversed.map((chat) => (
    //           <Chat key={chat.chatId} chat={chat} />
    //         ))}
    //         <div ref={bottomRef}></div>
    //       </div>
    //     </ScrollArea>
    //   </main>
    // </div>
  );
}
