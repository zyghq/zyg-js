import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

export default function SendMessageCTA({ ctaText }: { ctaText: string }) {
  return (
    <Button
      variant="default"
      className="w-full bg-blue-700 hover:bg-blue-800 text-white font-normal"
      asChild
    >
      <Link href="/threads">{ctaText}</Link>
    </Button>
  );
}
