// import { z } from "zod";
// import { createThreadResponseSchema, CreateThreadResponse } from "./lib/thread";
// import { customerSchema, Customer } from "./lib/customer";

// interface CreateThreadBody {
//   message: string;
//   email?: string | null;
//   name?: string | null;
//   redirectHost?: string | null;
// }

// interface SendMessageBody {
//   message: string;
// }

// // API creates a thread.
// // Also validates the response schema, returns data and error.


// // API sends a message to a thread.
// // Also validates the response schema, returns data and error.
// export async function sendThreadMessageAPI(
//   widgetId: string,
//   threadId: string,
//   jwt: string,
//   body: SendMessageBody
// ) {
//   try {
//     const response = await fetch(
//       `${import.meta.env.VITE_ZYG_XAPI_URL}/widgets/${widgetId}/threads/chat/${threadId}/messages/`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${jwt}`,
//         },
//         body: JSON.stringify(body),
//       }
//     );

//     if (!response.ok) {
//       const { status, statusText } = response;
//       console.error(
//         `Failed to send thread message. Status: ${status} ${statusText}`
//       );
//       return {
//         data: null,
//         error: {
//           message: "Failed. Please try again later.",
//         },
//       };
//     }
//     const data = await response.json();
//     return {
//       error: null,
//       data,
//     };
//   } catch (err) {
//     console.error("Something went wrong", err);
//     return {
//       error: {
//         message: "Something went wrong. Please try again later.",
//       },
//       data: null,
//     };
//   }
// }

// // Fetch widget customer.


// export async function getThreadMessagesAPI(
//   widgetId: string,
//   threadId: string,
//   jwt: string
// ) {
//   try {
//     const response = await fetch(
//       `${import.meta.env.VITE_ZYG_XAPI_URL}/widgets/${widgetId}/threads/chat/${threadId}/messages/`,
//       {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${jwt}`,
//         },
//       }
//     );

//     if (!response.ok) {
//       const { status, statusText } = response;
//       console.error(
//         `Failed to send thread message. Status: ${status} ${statusText}`
//       );
//       return {
//         data: null,
//         error: {
//           message: "Failed. Please try again later.",
//         },
//       };
//     }
//     const data = await response.json();
//     return {
//       error: null,
//       data,
//     };
//   } catch (err) {
//     console.error("Something went wrong", err);
//     return {
//       error: {
//         message: "Something went wrong. Please try again later.",
//       },
//       data: null,
//     };
//   }
// }
