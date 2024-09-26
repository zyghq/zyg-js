import { forwardRef, ComponentPropsWithoutRef } from "react";
import { cn } from "@lib/lib/utils";

import { MessageCircleIcon } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@lib/components/ui/popover";
import { WidgetHeader } from "@lib/@components/header";
import { WidgetFooter } from "@lib/@components/footer";

export function WidgetPopup() {
  return (
    <Popover>
      <div style={{ display: "content" }} data-chat-widget>
        <PopoverContent
          className="px-1 py-1 min-w-96 max-w-96"
          onInteractOutside={(e) => e.preventDefault()}
          side="top"
          data-chat-widget
          align="end"
          sideOffset={10}
        >
          <Widget className="font-inter max-h-[85dvh]  z-[200] h-[600px] w-full" />
        </PopoverContent>
      </div>
      <PopoverTrigger className="bottom-8 right-4 absolute p-3 border rounded-full z-[200]">
        <MessageCircleIcon className="w-5 h-5" />
      </PopoverTrigger>
    </Popover>
  );
}

export const Widget = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<"div">
>(({ className, ...props }, _ref) => {
  return (
    <div style={{ display: "contents" }} data-chat-widget>
      <div
        {...props}
        ref={_ref}
        className={cn(
          "font-inter size-full overflow-hidden isolate relative",
          className
        )}
      >
        <div className="size-full antialiased font-inter flex flex-col h-full">
          <WidgetHeader />
          ...widget contents...
          <WidgetFooter className="mt-auto" />
        </div>
      </div>
    </div>
  );
});
