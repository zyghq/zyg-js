"use client";

import * as React from "react";
import { z } from "zod";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
} from "@tanstack/react-query";
import {
  authenticatedCustomerAuthSchema,
  CustomerContext,
  initWidgetResponseSchema,
  InitWidgetResponse,
  AuthenticatedCustomer,
} from "@/lib/customer";
import { SdkInitResponse, WidgetLayout } from "@/lib/widget";
import { useQuery } from "@tanstack/react-query";
import { getMeAPI } from "@/api";

const defaultWidgetLayout = {
  title: "Hey! How can we help",
  ctaSearchButtonText: "Search for articles, help docs and more...",
  ctaMessageButtonText: "Send us a message",
  tabs: ["home", "conversations"],
  defaultTab: "home",
  homeLinks: [],
};

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

async function initWidgetRequest(
  payload: SdkInitResponse
): Promise<InitWidgetResponse> {
  const { widgetId, sessionId, ...rest } = payload;
  const { email, phone, externalId, customerHash, traits = null } = rest;
  // give what the API needs.
  const body = {
    sessionId,
    customerExternalId: externalId,
    customerEmail: email,
    customerPhone: phone,
    customerHash,
    traits,
  };

  const response = await fetch(
    `http://localhost:8000/widgets/${widgetId}/init/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    throw new Error("Not Found");
  }

  const responseData = await response.json();
  try {
    const parsedData = initWidgetResponseSchema.parse(responseData);
    return {
      ...parsedData,
    };
  } catch (error) {
    console.error("Error parsing init widget response schema", error);
    throw new Error("Invalid customer response data");
  }
}

export function CustomerProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = React.useState<AuthenticatedCustomer | null>(
    null
  );
  const [widgetLayout, setWidgetLayout] =
    React.useState<WidgetLayout>(defaultWidgetLayout);

  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);

  // send post message to parent to indicate that the widget is ready.
  useQuery({
    queryKey: ["ifc:ready"],
    queryFn: async () => {
      window.parent.postMessage("ifc:ready", "*");
      return true;
    },
  });

  // makes the request to initialize the widget for the provided customer.
  const initMutate = useMutation({
    mutationFn: async (payload: SdkInitResponse) => {
      const response = await initWidgetRequest(payload);
      const { widgetId, sessionId } = payload;
      const customerContext = {
        ...response,
        widgetId,
        sessionId,
      };
      try {
        const parsedCustomerContext =
          authenticatedCustomerAuthSchema.parse(customerContext);
        return parsedCustomerContext;
      } catch (err) {
        if (err instanceof z.ZodError) {
          console.error("error parsing built customer context", err);
          throw new Error("error parsing built customer context");
        }
      }
      return null;
    },
    onSuccess: (data) => {
      setCustomer(data);
      // send post message to parent to indicate that
      // the widget has acknowledged the customer.
      window.parent.postMessage("ifc:ack", "*");
    },
    onError: (error, variables, context) => {
      console.log("onError", error, variables, context);
      setHasError(true);
      // TODO: handle different types of errors like:
      // bad configuration, network errors, authentication, etc.
    },
  });

  const customerRefresh = useMutation({
    mutationFn: async () => {
      const jwt = customer?.jwt || "";
      const widgetId = customer?.widgetId || "";
      const response = await getMeAPI(widgetId, jwt);
      const { error, data } = response;
      if (error) {
        const { message } = error;
        console.error("Error fetching customer", message);
        return null;
      }
      if (data) {
        return {};
      }
      return null;
    },
    onSuccess: (data) => {
      if (customer && data) {
        const updates = { ...customer, ...data } as AuthenticatedCustomer;
        setCustomer({ ...updates });
      }
    },
    onError: (error, variables, context) => {
      console.log("onError", error, variables, context);
    },
  });

  React.useEffect(() => {
    // TODO: have some kind of onMessageHandler with callback
    // that can be used to handle messages from the parent.
    // makes it more extensible.
    const onMessageHandler = async (e: MessageEvent) => {
      try {
        console.log("*********** ifc:onMessageHandler ***********");
        const data = JSON.parse(e.data);
        if (data.type === "layout") {
          const response = JSON.parse(data.data) as WidgetLayout;
          setWidgetLayout(response);
        }
        if (data.type === "customer") {
          console.log("*************** customer data iframe ***************");
          console.log(data.data);
          const response = JSON.parse(data.data) as SdkInitResponse;
          initMutate.mutate({ ...response });
        }
        if (data.type === "start") {
          setIsLoading(false);
        }
      } catch (err) {
        console.error("error processing evt message:", err);
      } finally {
        console.log("*********** ifc:onMessageHandler ***********");
      }
    };
    window.addEventListener("message", onMessageHandler);
    return () => {
      console.log("removing message listener");
      window.removeEventListener("message", onMessageHandler);
    };
  }, [initMutate]);

  const value = {
    isLoading,
    hasError,
    customer,
    widgetLayout,
    customerRefresh,
  };

  return (
    <CustomerContext.Provider value={value}>
      {children}
    </CustomerContext.Provider>
  );
}
