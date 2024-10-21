import * as React from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useMutation,
} from "@tanstack/react-query";

import { buildWidgetStore, widgetValues } from "@/models/store";
import { StoreApi, useStore } from "zustand";
import type { WidgetConfig, Customer } from "@zyg-js/core";
import { initWidgetRequest, widgetConfigSchema } from "@zyg-js/core";

export const ReactQueryClientProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
          },
        },
      })
  );
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const createZustandContext = <TInitial, TStore extends StoreApi<any>>(
  getStore: (initial: TInitial) => TStore
) => {
  const Context = React.createContext(null as any as TStore);

  const Provider = (props: {
    children?: React.ReactNode;
    initialValue: TInitial;
  }) => {
    const [store] = React.useState(() => getStore(props.initialValue));

    return <Context.Provider value={store}>{props.children}</Context.Provider>;
  };

  return {
    Context,
    Provider,
    useContext: () => React.useContext(Context),
  };
};

const widgetStore = createZustandContext(buildWidgetStore);
export const WidgetStoreContext = widgetStore.Context;
export const WidgetStoreProvider = widgetStore.Provider;

export function WidgetStore({ children }: { children: React.ReactNode }) {
  useQuery({
    queryKey: ["ifc:ready"],
    queryFn: async () => {
      // notify host what widget is ready to receive messages.
      window.parent.postMessage("ifc:ready", "*");
      return true;
    },
  });
  return (
    <WidgetStoreProvider initialValue={widgetValues()}>
      {children}
    </WidgetStoreProvider>
  );
}

export function useWidgetStore() {
  const context = React.useContext(WidgetStoreContext);
  if (!context) {
    throw new Error(
      "useWorkspaceStore must be used within a WorkspaceStoreProvider"
    );
  }
  return context;
}

export function WidgetPostMessageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const widgetStore = useWidgetStore();
  const actions = useStore(widgetStore, (state) => state.actions);

  const hasData = useStore(widgetStore, (state) => state.hasData);
  const hasError = useStore(widgetStore, (state) => state.hasError);

  const initWidgetMutation = useMutation({
    mutationFn: async (payload: WidgetConfig) => {
      const widgetId = payload.widgetId;
      const customer = payload.customer;

      const makeTraits = (): Record<string, string> => {
        const { firstName, lastName, name } = customer || {};
        const traits: Record<string, string> = {};
        if (firstName) traits.firstName = firstName;
        if (lastName) traits.lastName = lastName;
        if (!firstName && !lastName && name) traits.name = name;
        return traits;
      };
      // build the request body.
      const body = {
        sessionId: payload.sessionId,
        customerExternalId: payload.customer?.externalId,
        customerEmail: payload.customer?.email,
        customerHash: payload.customer?.customerHash,
        traits: makeTraits(),
      };
      try {
        const response = await initWidgetRequest(widgetId, body);
        const customer: Customer = {
          customerId: response.customerId,
          email: response.email,
          externalId: response.externalId,
          name: response.name,
          isEmailVerified: response.isEmailVerified,
          isEmailPrimary: response.isEmailPrimary,
          phone: response.phone,
          avatarUrl: response.avatarUrl,
          role: response.role,
          createdAt: response.createdAt,
          updatedAt: response.updatedAt,
        };
        const authInfo = {
          jwt: response.jwt,
          create: response.create,
        };
        actions.setCustomer(customer);
        actions.setAuthToken(authInfo.jwt);
        actions.setWidgetConfig(payload);
        actions.setHasData(true);
        actions.setHasError(false);
      } catch (err) {
        // notify host for error.
        window.parent.postMessage("ifc:error", "*");
        actions.setHasError(true);
        throw err;
      }
    },
    onSuccess: () => {
      actions.setHasData(true);
    },
    onError: () => {
      actions.setHasError(true);
    },
  });

  React.useEffect(() => {
    const onMessageHandler = async (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data);
        if (data.type === "config") {
          const response = JSON.parse(data.data) as WidgetConfig;
          const parsed = widgetConfigSchema.parse(response);
          initWidgetMutation.mutate(parsed);
        }
        if (data.type === "start") {
          console.log("done!");
        }
      } catch (err) {
        console.error("error processing evt message:", err);
        actions.setHasError(true);
      }
    };
    window.addEventListener("message", onMessageHandler);
    return () => {
      console.log("unmount post message listener...");
      window.removeEventListener("message", onMessageHandler);
    };
  }, [initWidgetMutation, actions]);

  if (hasError) {
    console.log("..... has error", hasError);
    return <div>Error!</div>;
  }

  if (hasData) {
    return <>{children}</>;
  }

  return <div>Loading...</div>;
}
