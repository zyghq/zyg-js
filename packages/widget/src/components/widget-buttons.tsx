import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ArrowLeftIcon, Cross1Icon } from "@radix-ui/react-icons";

export function SendMessageButton({ ctaText }: { ctaText: string }) {
  return (
    <Button variant="default" asChild>
      <Link to="/threads/new">{ctaText}</Link>
    </Button>
  );
}

export function HomeButton() {
  return (
    <Button variant="outline" size="icon" className="mr-1" asChild>
      <Link to="/">
        <ArrowLeftIcon className="h-4 w-4" />
      </Link>
    </Button>
  );
}

export function CloseButton() {
  const handleClose = () => {
    window.parent.postMessage("close", "*");
  };

  return (
    <Button variant="outline" size="icon" onClick={handleClose}>
      <Cross1Icon className="h-4 w-4" />
    </Button>
  );
}

export function ThreadListButton() {
  return (
    <Button variant="outline" size="icon" className="mr-1" asChild>
      <Link to="/threads">
        <ArrowLeftIcon className="h-4 w-4" />
      </Link>
    </Button>
  );
}
