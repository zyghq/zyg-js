import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function HomeButton() {
  return (
    <Button variant="outline" size="icon" className="mr-1" asChild>
      <Link to="/">
        <ArrowLeftIcon className="h-4 w-4" />
      </Link>
    </Button>
  );
}
