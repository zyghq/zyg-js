import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

export function SendMessageCTA({ ctaText }: { ctaText: string }) {
  return (
    <Button variant="default" className="w-full" asChild>
      <Link to="/threads">{ctaText}</Link>
    </Button>
  );
}
