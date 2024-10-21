import { createStore } from "zustand/vanilla";
import { immer } from "zustand/middleware/immer";
import defaults from "defaults";
import type { Customer, WidgetConfig, HomeLink } from "@zyg-js/core";

export interface IWidgetActions {
  setHasData(hasData: boolean): void;
  setHasError(hasError: boolean): void;
  setAuthToken(token: string): void;
  setCustomer(customer: Customer): void;
  setWidgetConfig(widgetConfig: WidgetConfig): void;
  getAuthToken(state: WidgetStore): string;
  getWidgetId(state: WidgetStore): string;
  getWidgetTitle(state: WidgetStore): string;
  getWidgetTeam(state: WidgetStore): string;
  getTabs(state: WidgetStore): string[];
  getHomeLinks(state: WidgetStore): HomeLink[] | [];
  getCustomerHash(state: WidgetStore): string | null;
  getWidgetCustomerEmail(state: WidgetStore): string | null;
  getWidgetCustomerExternalId(state: WidgetStore): string | null;
  getWidgetCustomerName(state: WidgetStore): string | null;
}

// Represents widget store values.
export interface IWidgetValues {
  hasData: boolean;
  hasError: boolean;
  widgetConfig: WidgetConfig; // from sdk.
  customer: Customer | null; // after API request.
  authToken: string; // after API request.
}

export const widgetValues = (options: { [key: string]: any } = {}) =>
  defaults(options, {
    hasData: false,
    hasError: false,
    widgetConfig: {
      widgetId: "",
      sessionId: null,
      customer: null,
      layout: {
        title: "Hey! How can we help?",
        team: "Zyg Support",
        tabs: ["home", "conversations", "search"],
        homeLinks: [],
      },
    },
    customer: null,
    authToken: "",
    hasConversations: false,
  }) as IWidgetValues;

export interface WidgetActions {
  actions: IWidgetActions;
}

// WidgetStore - combination of widget values and actions.
export type WidgetStore = IWidgetValues & WidgetActions;

export const buildWidgetStore = (initialState: IWidgetValues) => {
  return createStore<WidgetStore>()(
    immer((set) => ({
      ...initialState,
      actions: {
        setHasData: (hasData: boolean) => {
          set((state) => {
            state.hasData = hasData;
          });
        },
        setHasError: (hasError: boolean) => {
          set((state) => {
            state.hasError = hasError;
          });
        },
        setAuthToken: (token: string) => {
          set((state) => {
            state.authToken = token;
          });
        },
        setCustomer: (customer: Customer) => {
          set((state) => {
            state.customer = customer;
          });
        },
        setWidgetConfig: (widgetConfig: WidgetConfig) => {
          set((state) => {
            state.widgetConfig = widgetConfig;
          });
        },
        getAuthToken: (state: WidgetStore): string => {
          return state.authToken;
        },
        getWidgetId: (state: WidgetStore): string => {
          const widgetId = state.widgetConfig.widgetId;
          return widgetId;
        },
        getWidgetTitle: (state: WidgetStore): string => {
          const widgetTitle = state.widgetConfig?.layout?.title || "";
          return widgetTitle;
        },
        getWidgetTeam: (state: WidgetStore): string => {
          const widgetTeam = state.widgetConfig?.layout?.team || "";
          return widgetTeam;
        },
        getTabs: (state: WidgetStore): string[] => {
          const tabs = state.widgetConfig.layout?.tabs || [];
          return tabs;
        },
        getHomeLinks: (state: WidgetStore): HomeLink[] | [] => {
          const homeLinks = state.widgetConfig?.layout?.homeLinks || [];
          return homeLinks;
        },
        getCustomerHash: (state: WidgetStore) => {
          if (state.widgetConfig?.customer) {
            const hash = state.widgetConfig.customer?.customerHash || null;
            return hash;
          }
          return null;
        },
        getWidgetCustomerEmail: (state: WidgetStore) => {
          if (state.widgetConfig?.customer) {
            const email = state.widgetConfig.customer?.email || null;
            return email;
          }
          return null;
        },
        getWidgetCustomerExternalId: (state: WidgetStore) => {
          if (state.widgetConfig?.customer) {
            const externalId = state.widgetConfig.customer?.externalId || null;
            return externalId;
          }
          return null;
        },
        getWidgetCustomerName: (state: WidgetStore) => {
          if (state.widgetConfig?.customer) {
            const firstName = state.widgetConfig.customer?.firstName || null;
            const lastName = state.widgetConfig.customer?.lastName || null;
            if (firstName && lastName) {
              return `${firstName} ${lastName}`;
            }
            if (firstName) {
              return firstName;
            }
            if (lastName) {
              return lastName;
            }
            const name = state.widgetConfig.customer?.name || null;
            return name;
          }
          return null;
        },
      },
    }))
  );
};
