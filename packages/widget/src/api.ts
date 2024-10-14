import { z } from "zod";
import { createThreadResponseSchema, CreateThreadResponse } from "./lib/thread";
import { customerSchema, Customer } from "./lib/customer";

interface CreateThreadBody {
  message: string;
  email?: string | null;
  name?: string | null;
  redirectHost?: string | null;
}

interface SendMessageBody {
  message: string;
}

// API creates a thread.
// Also validates the response schema, returns data and error.
export async function createThreadAPI(
  widgetId: string,
  jwt: string,
  body: CreateThreadBody
): Promise<{
  error: { message: string } | null;
  data: CreateThreadResponse | null;
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
      console.error(`Failed to create thread. Status: ${status} ${statusText}`);
      return {
        data: null,
        error: {
          message: "Failed. Please try again later.",
        },
      };
    }
    const data = await response.json();
    try {
      const thread = createThreadResponseSchema.parse(data);
      return {
        error: null,
        data: thread,
      };
    } catch (err) {
      if (err instanceof z.ZodError) {
        console.error(
          "Failed response schema validation, update threadResponseSchema"
        );
        console.error(err.message);
      } else console.error(err);
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

// API sends a message to a thread.
// Also validates the response schema, returns data and error.
export async function sendThreadMessageAPI(
  widgetId: string,
  threadId: string,
  jwt: string,
  body: SendMessageBody
) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_ZYG_XAPI_URL}/widgets/${widgetId}/threads/chat/${threadId}/messages/`,
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
    return {
      error: null,
      data,
    };
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

// Fetch widget customer.
export async function getMeAPI(
  widgetId: string,
  jwt: string
): Promise<{
  error: { message: string } | null;
  data: Customer | null;
}> {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_ZYG_XAPI_URL}/widgets/${widgetId}/me/`,
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
      console.error(`Failed to add email profile: ${status} ${statusText}`);
      return {
        data: null,
        error: {
          message: "Failed. Please try again later.",
        },
      };
    }
    const data = await response.json();
    try {
      const parsed = customerSchema.parse(data);
      return {
        error: null,
        data: parsed,
      };
    } catch (err) {
      if (err instanceof z.ZodError) {
        console.error(
          "Failed response schema validation, update customerSchema"
        );
        console.error(err.message);
      } else console.error(err);
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
) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_ZYG_XAPI_URL}/widgets/${widgetId}/threads/chat/${threadId}/messages/`,
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
    return {
      error: null,
      data,
    };
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
