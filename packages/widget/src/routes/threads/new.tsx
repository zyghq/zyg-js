import { createFileRoute } from "@tanstack/react-router";
import { CloseButton, ThreadListButton } from "@/components/widget-buttons";
import {
  StartThreadWithEmailProfileForm,
  StartThreadForm,
} from "@/components/forms";
import { useWidgetStore } from "@/components/providers";
import { useStore } from "zustand";

export const Route = createFileRoute("/threads/new")({
  component: NewThread,
});

function NewThread() {
  const navigate = Route.useNavigate();
  const store = useWidgetStore();
  const team = useStore(store, (state) => state.actions.getWidgetTeam(state));
  const jwt = useStore(store, (state) => state.actions.getAuthToken(state));
  const widgetId = useStore(store, (state) => state.actions.getWidgetId(state));
  const hasIdentity = useStore(store, (state) =>
    state.actions.hasIdentity(state)
  );

  return (
    <div>
      <div className="flex w-full justify-between p-4 border-b">
        <div>
          <div className="flex gap-1">
            <ThreadListButton />
            <div>
              <div className="text-md font-semibold">{team}</div>
              <div className="text-xs text-muted-foreground">
                Ask us anything, or share your feedback.
              </div>
            </div>
          </div>
        </div>
        <CloseButton />
      </div>
      <div className="fixed bottom-0 left-0 flex w-full flex-col px-4 py-2 gap-2">
        {hasIdentity ? (
          <StartThreadForm widgetId={widgetId} jwt={jwt} navigate={navigate} />
        ) : (
          <StartThreadWithEmailProfileForm
            widgetId={widgetId}
            jwt={jwt}
            navigate={navigate}
          />
        )}
        <div className="w-full border-t flex justify-center items-center">
          <a
            href="https://www.zyg.ai/"
            className="text-xs font-semibold text-muted-foreground pt-2"
            target="_blank"
          >
            Powered by Zyg
          </a>
        </div>
      </div>
    </div>
  );
}
