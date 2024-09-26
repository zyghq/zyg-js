import { Button } from "@lib/components/ui/button";
import { XIcon } from "lucide-react";

export function WidgetHeader() {
  return (
    <div className="flex w-full justify-between items-center p-4 bg-white">
      <div className="text-xl">{`Zyg`}</div>
      <Button variant="outline" size="icon" onClick={() => {}}>
        <XIcon className="w-4 h-4" />
      </Button>
    </div>
  );
}
