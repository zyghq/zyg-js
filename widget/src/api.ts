import { z } from "zod";
import { createThreadResponseSchema, CreateThreadResponse } from "./lib/thread";

interface CreateThreadBody {
  message: string;
}

interface SendMessageBody {
  message: string;
}

interface AddEmailBody {
  email: string;
  name: string;
  redirectHost?: string;
  contextThreadId?: string;
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

// API adds email profile for the customer.
export async function addEmailProfileAPI(
  widgetId: string,
  jwt: string,
  body: AddEmailBody
) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_ZYG_XAPI_URL}/widgets/${widgetId}/me/identities/`,
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
      console.error(`Failed to add email profile: ${status} ${statusText}`);
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
