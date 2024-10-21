import { Link } from "@tanstack/react-router";

import {
  HomeIcon,
  ChatBubbleIcon,
  MagnifyingGlassIcon,
  // PersonIcon,
} from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

export function BottomNavigation() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 h-16 w-full border-t bg-white shadow-t dark:border-gray-800 dark:bg-gray-950 flex justify-around items-center">
      <Link
        activeOptions={{ exact: true }}
        to="/"
        activeProps={{
          className: "text-gray-900 dark:text-gray-50",
        }}
        className={cn(
          "flex flex-col items-center justify-center gap-1 text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400"
        )}
      >
        <HomeIcon className="h-5 w-5" />
        <span className="text-sm font-medium">Home</span>
      </Link>
      <Link
        activeOptions={{ exact: true }}
        to="/threads"
        activeProps={{
          className: "text-gray-900 dark:text-gray-50",
        }}
        className={cn(
          "flex flex-col items-center justify-center gap-1 text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400"
        )}
      >
        <ChatBubbleIcon className="h-5 w-5" />
        <span className="text-sm font-medium">Threads</span>
      </Link>
      <Link
        activeOptions={{ exact: true }}
        to="/search"
        activeProps={{
          className: "text-gray-900 dark:text-gray-50",
        }}
        className={cn(
          "flex flex-col items-center justify-center gap-1 text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400"
        )}
      >
        <MagnifyingGlassIcon className="h-5 w-5" />
        <span className="text-sm font-medium">Search</span>
      </Link>
      {/* <Link
          href="#"
          className="flex flex-col items-center justify-center gap-1 text-gray-500 transition-colors hover:text-gray-900 data-[active=true]:text-gray-900 dark:text-gray-400 dark:data-[active=true]:text-gray-50"
        >
          <PersonIcon className="h-5 w-5" />
          <span className="text-sm font-medium">Profile</span>
        </Link> */}
    </div>
  );
}
