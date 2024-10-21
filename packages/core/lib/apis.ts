import { DEFAULT_OPTIONS } from "./constants";
import {
  customerSchemaObj,
  newCustomerThreadSchema,
  threadSchema,
  threadChatSchema,
} from "./schemas";
import type { NewCustomerThreadChat, Thread, ThreadChat } from "./types";
import { z } from "zod";

// Represents the request body for the widget init API.
interface InitWidgetReqBody {
  sessionId?: string | undefined;
  customerExternalId?: string | undefined;
  customerEmail?: string | undefined;
  customerHash?: string | undefined;
  traits?: Record<string, string> | undefined;
}

const customerAuthSchemaObj = {
  jwt: z.string(),
  create: z.boolean(),
};

// Response structure from the widget init API.
const initWidgetResponseSchemaObj = {
  ...customerAuthSchemaObj,
  ...customerSchemaObj,
};
const initWidgetResponseSchema = z.object(initWidgetResponseSchemaObj);

export async function initWidgetRequest(
  widgetId: string,
  body: InitWidgetReqBody
) {
  const response = await fetch(
    `${DEFAULT_OPTIONS.apiUrl}/widgets/${widgetId}/init/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const responseData = await response.json();
  try {
    const parsedData = initWidgetResponseSchema.parse(responseData);
    return {
      ...parsedData,
    };
  } catch (error) {
    console.error("Error parsing init widget response schema", error);
    throw new Error("Invalid init widget response data");
  }
}

interface CreateThreadReqBody {
  message: string;
  email?: string | null;
  name?: string | null;
  redirectHost?: string | null;
}

export async function createThreadAPI(
  widgetId: string,
  jwt: string,
  body: CreateThreadReqBody
): Promise<{
  error: { message: string } | null;
  data: NewCustomerThreadChat | null;
}> {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_ZYG_XAPI_URL}/widgets/${widgetId}/threads/chat/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const { status, statusText } = response;
      console.error(`Request failed: ${status} ${statusText}`);
      return {
        data: null,
        error: {
          message: `Failed to create new thread status: ${status}`,
        },
      };
    }
    const data = await response.json();
    try {
      const thread = newCustomerThreadSchema.parse(data);
      return {
        error: null,
        data: thread,
      };
    } catch (err) {
      console.error(err);
      return {
        error: {
          message: "Failed response schema validation",
        },
        data: null,
      };
    }
  } catch (err) {
    console.error(err);
    return {
      error: {
        message: "Something went wrong. Please try again later.",
      },
      data: null,
    };
  }
}

export async function getThreadChatsAPI(
  widgetId: string,
  jwt: string
): Promise<{
  error: { message: string } | null;
  data: Thread[] | null;
}> {
  try {
    const response = await fetch(
      `${DEFAULT_OPTIONS.apiUrl}/widgets/${widgetId}/threads/chat/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    if (!response.ok) {
      const { status, statusText } = response;
      console.error(`Request failed: ${status} ${statusText}`);
      return {
        data: null,
        error: {
          message: `Failed to get thread chats status: ${status}`,
        },
      };
    }

    const data: Thread[] = await response.json();
    try {
      const threads = data.map((t) => threadSchema.parse(t));
      return {
        error: null,
        data: threads,
      };
    } catch (err) {
      console.error("Error parsing thread response schema", err);
      return {
        error: {
          message: "Failed response schema validation",
        },
        data: null,
      };
    }
  } catch (err) {
    console.error("Something went wrong", err);
    return {
      error: {
        message: "Something went wrong. Please try again later.",
      },
      data: null,
    };
  }
}

export async function sendThreadMessageAPI(
  widgetId: string,
  threadId: string,
  jwt: string,
  body: { message: string }
): Promise<{
  error: { message: string } | null;
  data: ThreadChat | null;
}> {
  try {
    const response = await fetch(
      `${DEFAULT_OPTIONS.apiUrl}/widgets/${widgetId}/threads/chat/${threadId}/messages/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const { status, statusText } = response;
      console.error(
        `Failed to send thread message. Status: ${status} ${statusText}`
      );
      return {
        data: null,
        error: {
          message: "Failed. Please try again later.",
        },
      };
    }

    const data = await response.json();
    try {
      const parsed = threadChatSchema.parse(data);
      return {
        error: null,
        data: parsed,
      };
    } catch (err) {
      console.error("Error parsing thread chat response schema", err);
      return {
        error: {
          message: "Failed response schema validation",
        },
        data: null,
      };
    }
  } catch (err) {
    console.error("Something went wrong", err);
    return {
      error: {
        message: "Something went wrong. Please try again later.",
      },
      data: null,
    };
  }
}

export async function getThreadMessagesAPI(
  widgetId: string,
  threadId: string,
  jwt: string
): Promise<{
  error: { message: string } | null;
  data: ThreadChat[] | null;
}> {
  try {
    const response = await fetch(
      `${DEFAULT_OPTIONS.apiUrl}/widgets/${widgetId}/threads/chat/${threadId}/messages/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    if (!response.ok) {
      const { status, statusText } = response;
      console.error(
        `Failed to get thread messages. Status: ${status} ${statusText}`
      );
      return {
        data: null,
        error: {
          message: "Failed. Please try again later.",
        },
      };
    }
    const data: ThreadChat[] = await response.json();
    try {
      const chats = data.map((c) => threadChatSchema.parse(c));
      return {
        error: null,
        data: chats,
      };
    } catch (err) {
      console.error("Error parsing thread chat response schema", err);
      return {
        error: {
          message: "Failed response schema validation",
        },
        data: null,
      };
    }
  } catch (err) {
    console.error("Something went wrong", err);
    return {
      error: {
        message: "Something went wrong. Please try again later.",
      },
      data: null,
    };
  }
}
