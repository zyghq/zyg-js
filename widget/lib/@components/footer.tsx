import { cn } from "@lib/lib/utils";

export function WidgetFooter({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "w-full border-t flex justify-center items-center py-2",
        className
      )}
    >
      <a
        href="https://www.zyg.ai/"
        className="text-xs font-semibold text-muted-foreground"
        target="_blank"
      >
        Powered by Zyg
      </a>
    </div>
  );
}
