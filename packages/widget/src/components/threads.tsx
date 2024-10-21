import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "@tanstack/react-router";
import type { Thread } from "@zyg-js/core";

function ThreadItem({ thread }: { thread: Thread }) {
  const { customer, outboundMember } = thread;
  const memberName = outboundMember?.name || null;
  const memberId = outboundMember?.memberId || null;
  const hasMember = memberId && memberName;
  const customerId = customer.customerId;
  return (
    <Link
      to="/threads/$threadId"
      params={{ threadId: thread.threadId }}
      key={thread.threadId}
      className={cn(
        "flex flex-col items-start gap-2 rounded-lg border px-3 py-3 text-left text-sm transition-all hover:bg-accent"
      )}
    >
      <div className="flex w-full flex-col gap-1">
        <div className="flex items-center">
          <div className="flex items-center gap-2">
            {hasMember ? (
              <Avatar className="h-7 w-7">
                <AvatarImage
                  src={`https://avatar.vercel.sh/${memberId}?w=32&h=32`}
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            ) : (
              <Avatar className="h-7 w-7">
                <AvatarImage
                  src={`https://avatar.vercel.sh/${customerId}?w=32&h=32`}
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            )}
            <div className="font-medium">{`${
              hasMember ? memberName : "You"
            }`}</div>
          </div>
          <div
            className={cn(
              "ml-auto mr-2 text-xs",
              !thread.replied ? "text-foreground" : "text-muted-foreground"
            )}
          >
            {formatDistanceToNow(new Date(thread.updatedAt), {
              addSuffix: true,
            })}
          </div>
        </div>
      </div>
      <div className="line-clamp-2 text-sm">{thread.previewText}</div>
    </Link>
  );
}

export function Threads({ threads }: { threads: Thread[] }) {
  return (
    <div className="flex flex-col gap-2">
      {threads.map((thread) => (
        <ThreadItem key={thread.threadId} thread={thread} />
      ))}
    </div>
  );
}
