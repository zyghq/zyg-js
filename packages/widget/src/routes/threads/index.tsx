import { useCustomer } from "@/lib/customer";
import { createFileRoute } from "@tanstack/react-router";
import { HomeButton } from "@/components/home-btn";
import { CloseButton } from "@/components/close-btn";
import {
  StartThreadWithEmailProfileForm,
  StartThreadForm,
} from "@/components/forms";

export const Route = createFileRoute("/threads/")({
  component: NewThread,
});

function NewThread() {
  const navigate = Route.useNavigate();
  const { isLoading, hasError, customer, customerRefresh } = useCustomer();
  const widgetId = customer?.widgetId;
  const jwt = customer?.jwt;

  if (hasError) {
    return (
      <div className="absolute z-10 h-full w-full flex items-center justify-center">
        <div className="flex flex-col items-center justify-center text-muted-foreground">
          <span className="text-lg">{`We're sorry, something went wrong.`}</span>
          <span className="text-lg">Please try again later.</span>
        </div>
      </div>
    );
  }

  if (!widgetId || !jwt) {
    return (
      <div className="absolute z-10 h-full w-full flex items-center justify-center">
        <div className="flex flex-col items-center justify-center text-muted-foreground">
          <span className="text-lg">Widget is not configured yet.</span>
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

  return (
    <div className="flex min-h-screen flex-col font-sans">
      <div className="z-10 w-full justify-between">
        <div className="flex items-center justify-start py-4 border-b px-4 gap-1">
          <HomeButton />
          <div>
            <div className="flex flex-col">
              <div className="font-semibold">Zyg Team</div>
              <div className="text-xs text-muted-foreground">
                Ask us anything, or share your feedback.
              </div>
            </div>
          </div>
          <div className="ml-auto">
            <CloseButton />
          </div>
        </div>
        <div className="fixed bottom-0 left-0 flex w-full flex-col bg-white">
          <div className="w-full px-4 py-4">
            {customer.email ? (
              <StartThreadForm
                widgetId={widgetId}
                jwt={jwt}
                navigate={navigate}
              />
            ) : (
              <StartThreadWithEmailProfileForm
                widgetId={widgetId}
                jwt={jwt}
                navigate={navigate}
                customerRefresh={customerRefresh}
              />
            )}
          </div>
          <div className="w-full border-t flex justify-center items-center py-2">
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
      <main></main>
    </div>
  );
}
