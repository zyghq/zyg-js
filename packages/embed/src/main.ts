import { z } from "zod";
import defaults from "defaults";

const IS_SERVER = typeof window === "undefined";
const ENV = window.ZygEnv || "production";
import { DEFAULT_OPTIONS, widgetConfigSchema } from "@zyg-js/core";

const DEFAULT_BASE_URL =
  import.meta.env.VITE_WIDGET_BASE_URL || "http://localhost:3005"; // base url for the iframe

const logger = (() => {
  if (ENV === "development") {
    return console.log.bind(console);
  } else {
    return () => {}; // noop function
  }
})();

// Represents kv data type.
type KV = { [key: string]: string | any };

// Represents widget configuration API.
// This is also the input to the embed sdk.
type WidgetConfig = z.infer<typeof widgetConfigSchema>;

type Customer = z.infer<typeof widgetConfigSchema.shape.customer>;
type WidgetLayout = z.infer<typeof widgetConfigSchema.shape.layout>;

type BubblePosition = "left" | "right";
type Domains = string[] | null;
type ProfilePicture = string | null;

// Represents widget sdk options.
interface WidgetSdkOpts {
  domainsOnly: boolean; // only allow domains in domains array
  domains: Domains; // only allow domains in domains array
  bubblePosition: BubblePosition;
  headerColor: string;
  profilePicture: ProfilePicture;
  iconColor: string;
}

// Represents widget sdk overrides.
interface OverrideSdkAddOns {
  baseUrl?: string;
  apiUrl?: string;
}

// Represents full widget configuration with sdk options.
type WidgetConfigWithSdkOpts = WidgetConfig & WidgetSdkOpts & OverrideSdkAddOns;

const customer = (options: KV) =>
  defaults(options, {
    email: undefined,
    externalId: undefined,
    customerHash: undefined,
    name: undefined,
    lastName: undefined,
    firstName: undefined,
  }) as Customer;

const sdkOpts = (options: KV) =>
  defaults(options, {
    domainsOnly: false,
    domains: null,
    bubblePosition: "right",
    headerColor: "#9370DB",
    profilePicture: null,
    iconColor: "#ffff",
  }) as WidgetSdkOpts;

const widgetLayout = (options: KV) =>
  defaults(options, {
    title: "Zyg Support",
    team: "Zyg",
    tabs: ["home", "conversations", "search"],
    homeLinks: [],
  }) as WidgetLayout;

// Represents the SDK instance and API interface.
interface ZygSDKInstance {
  _eventTarget: EventTarget;
  _triggerEvent: (eventName: string, data: any) => void;
  on: (eventName: string, callback: EventListenerOrEventListenerObject) => void;
  off: (
    eventName: string,
    callback: EventListenerOrEventListenerObject
  ) => void;
  onMessageHandler: (evt: MessageEvent) => void;
  init: () => any;
}

class SetLocalStorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SetLocalStorageError";
  }
}

class GetLocalStorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GetLocalStorageError";
  }
}

/**
 * Sets a key-value pair in localStorage if available
 * @param key The key to set
 * @param value The value to set
 * @returns true if the operation was successful, false otherwise
 */
function setLocalStorage(
  key: string,
  value: string
): [boolean, SetLocalStorageError | null] {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem(key, value);
      return [true, null];
    }
    return [false, new SetLocalStorageError("Error setting localStorage")];
  } catch (error) {
    return [false, new SetLocalStorageError("Error setting localStorage")];
  }
}

/**
 * Gets a key-value pair from localStorage if available
 * @param key The key to get
 * @returns The value if the operation was successful, null otherwise
 */
function getLocalStorage(
  key: string
): [string | null, GetLocalStorageError | null] {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      return [localStorage.getItem(key), null];
    }
    return [null, new GetLocalStorageError("Error getting localStorage")];
  } catch (error) {
    return [null, new GetLocalStorageError("Error getting localStorage")];
  }
}

/**
 * Generates a UUID v4 (random)
 * @returns A string representing a UUID v4
 */
function generateUUID(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    // Use the built-in crypto.randomUUID() if available
    return crypto.randomUUID();
  }

  // Fallback to manual UUID generation
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function initZygWidgetScript(initConfig: WidgetConfigWithSdkOpts) {
  if (IS_SERVER) {
    return;
  }
  (function () {
    var widgetSdkOpts: WidgetSdkOpts;
    var isHidden = !0;
    var pageWidth = window.innerWidth;

    const baseUrl = initConfig.baseUrl || DEFAULT_BASE_URL; // base url for the iframe
    const apiUrl = initConfig.apiUrl || DEFAULT_OPTIONS.apiUrl; // backend api url for the widget

    // fetch widget remote opts.
    function fetchWidgetConfig(widgetId: string): Promise<WidgetSdkOpts> {
      return fetch(`${apiUrl}/widgets/${widgetId}/config/`).then((res) =>
        res.json()
      );
    }

    function hideZW() {
      var t = document.getElementById("zyg-frame");
      if (!t) return;
      (t.style.opacity = "0"),
        (t.style.transform = "scale(0)"),
        (t.style.position = "fixed");

      const e = document.getElementById("zyg-button");
      if (!e) return;
      e.style.display = "block";
      isHidden = !0;
    }

    function showZW() {
      var t = document.getElementById("zyg-frame");
      if (!t) return;
      (t.style.opacity = "1"),
        (t.style.transform = "scale(1)"),
        (t.style.position = "fixed");

      if (pageWidth < 768) {
        const e = document.getElementById("zyg-button");
        if (!e) return;
        e.style.display = "none";
      }
      isHidden = !1;
    }

    // handleWidgetConfig is triggered by post message when the iframe is ready.
    // Inturn, sends the widget layout payload to the iframe.
    function handleWidgetConfig(payload: WidgetConfig): boolean {
      const iframe: HTMLIFrameElement = document.getElementById(
        "zyg-iframe"
      ) as HTMLIFrameElement;
      if (!iframe) throw new Error("zyg widget Iframe not configured yet!");
      const message = {
        type: "config", // type of message being sent
        data: JSON.stringify(payload), // data payload to be sent to iframe.
      };

      if (iframe.contentWindow) {
        iframe.contentWindow.postMessage(JSON.stringify(message), baseUrl);
        return true;
      }
      throw new Error("zyg widget Iframe not configured!");
    }

    // handleAcknowledge is triggered by post message
    // when the iframe has received the customer data and acknowledges.
    // Inturn, sends the `start` message to the iframe.
    function handleAcknowledge(): boolean {
      const iframe: HTMLIFrameElement = document.getElementById(
        "zyg-iframe"
      ) as HTMLIFrameElement;

      if (!iframe) throw new Error("zyg widget Iframe not configured!");
      const message = {
        type: "start",
        data: JSON.stringify(null),
      };

      if (iframe.contentWindow) {
        iframe.contentWindow.postMessage(JSON.stringify(message), baseUrl);
        return true;
      }
      throw new Error("zyg widget Iframe not configured!");
    }

    // handlePageWidthChange is triggered by window resize
    function handlePageWidthChange() {
      pageWidth = window.innerWidth;
      var t = document.getElementById("zyg-frame");

      if (!t) return;

      // Determine styles based on screen width
      const sizeStyles =
        pageWidth > 768
          ? "width: 448px; height: 72vh; max-height: 720px;"
          : "width: 100%; height: 100%; max-height: 100%; min-height: 100%; left: 0px; right: 0px; bottom: 0px; top: 0px;";

      // Determine bubble position (left or right)
      const positionStyles =
        widgetSdkOpts.bubblePosition === "right"
          ? "right: 16px; left: unset; transform-origin: right bottom;"
          : "left: 16px; right: unset; transform-origin: left bottom;";

      // Determine visibility and transform scale
      const visibilityStyles = isHidden
        ? "opacity: 0 !important; transform: scale(0) !important;"
        : "opacity: 1 !important; transform: scale(1) !important;";

      // Apply final styles to the element
      t.style.cssText =
        "box-shadow: rgba(150, 150, 150, 0.2) 0px 10px 30px 0px, " +
        "rgba(150, 150, 150, 0.2) 0px 0px 0px 1px; " +
        "overflow: hidden !important; " +
        "border: none !important; " +
        "display: block !important; " +
        "z-index: 2147483645 !important; " +
        "border-radius: 0.75rem; " +
        "bottom: 96px; " +
        "transition: scale 200ms ease-out 0ms, opacity 200ms ease-out 0ms; " +
        "position: fixed !important;" +
        positionStyles +
        sizeStyles +
        visibilityStyles;
    }

    // createZygWidget creates the iframe widget
    function createZygWidget(config: WidgetSdkOpts) {
      if (config.domainsOnly && config.domains) {
        const domains = config.domains;
        const d = window.location.hostname;
        if (!domains.includes(d)) {
          console.error(
            "Domain not allowed! Try configuring domains in Zyg workspace or locally in the config."
          );
          return;
        }
      }

      // create the iframe parent div container
      var frameContainer = document.createElement("div");
      frameContainer.setAttribute("id", "zyg-frame");
      // add styling
      var fcs =
          pageWidth > 768
            ? "width: 448px; height: 72vh; max-height: 720px"
            : "width: 100%; height: 100%; max-height: 100%; min-height: 100%; left: 0px; right: 0px; bottom: 0px; top: 0px;",
        bbp =
          config.bubblePosition && "right" === config.bubblePosition
            ? "right: 16px; left: unset; transform-origin: right bottom;"
            : "left: 16px; right: unset; transform-origin: left bottom;";
      frameContainer.style.cssText =
        "position: fixed !important; " +
        "box-shadow: rgba(150, 150, 150, 0.2) 0px 10px 30px 0px, " +
        "rgba(150, 150, 150, 0.2) 0px 0px 0px 1px; " +
        "overflow: hidden !important; " +
        "opacity: 0 !important; " +
        "border: none !important; " +
        "display: none !important; " +
        "z-index: 2147483645 !important; " +
        "border-radius: 0.75rem; " +
        "bottom: 96px; " +
        "transition: scale 200ms ease-out 0ms, opacity 200ms ease-out 0ms; " +
        "transform: scale(0) !important;" +
        bbp +
        fcs;

      // create the iframe container.
      var iframe = document.createElement("iframe");
      iframe.setAttribute("id", "zyg-iframe"),
        iframe.setAttribute("title", "Zyg Widget"),
        iframe.setAttribute("src", baseUrl),
        iframe.setAttribute("frameborder", "0"),
        iframe.setAttribute("scrolling", "no"),
        iframe.setAttribute(
          "style",
          "border: 0px !important; width: 100% !important; height: 100% !important; display: block !important; opacity: 1 !important;"
        ),
        frameContainer.appendChild(iframe), // append the Iframe to the parent div container.
        document.body.appendChild(frameContainer);

      iframe.addEventListener("load", function () {
        logger("iframe on load...");
        var popButton = document.createElement("div");
        popButton.setAttribute("id", "zyg-button");

        // add styling to the button
        var pbs = "background-color:" + config.headerColor + ";";
        (pbs += "position: fixed; bottom: 1rem;"),
          (pbs +=
            config.bubblePosition && "right" === config.bubblePosition
              ? "right: 16px; left: unset;"
              : "left: 16px; right: unset;"),
          (pbs +=
            "width: 50px; height: 50px; border-radius: 25px; 0px 4px 8px 0px; cursor: pointer; z-index: 2147483645;"),
          (pbs +=
            "transition: transform 0.2s ease-in-out, opacity 0.2s ease-in-out; transform: scale(0); opacity: 0;"),
          (popButton.style.cssText = pbs);

        var buttonInnerSt =
          '<div style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; z-index: 2147483646;">';
        config.profilePicture
          ? (buttonInnerSt +=
              '<img src="' +
              config.profilePicture +
              '" style="width: 100%; height: 100%; border-radius: 100px;" />')
          : (buttonInnerSt += `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${config.iconColor}" style="width: 60%; height: 60%;"><path fill-rule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97zM6.75 8.25a.75.75 0 01.75-.75h9a.75.75 0 010 1.5h-9a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H7.5z" clip-rule="evenodd" /></svg>`),
          (buttonInnerSt += "</div>"),
          (popButton.innerHTML = buttonInnerSt),
          document.body.appendChild(popButton);

        setTimeout(function () {
          (popButton.style.opacity = "1"),
            (popButton.style.transform = "scale(1)"),
            (frameContainer.style.display = "block");
        }, 1e3),
          popButton.addEventListener("click", function () {
            isHidden ? showZW() : hideZW();
          });
      });
    }

    var widgetConfig: WidgetConfig;

    const zyg = (initConfig: WidgetConfigWithSdkOpts): ZygSDKInstance => ({
      _eventTarget: new EventTarget(),
      _triggerEvent(eventName: string, data: any) {
        const event = new CustomEvent(eventName, { detail: data });
        this._eventTarget.dispatchEvent(event);
      },
      on(eventName: string, callback: EventListenerOrEventListenerObject) {
        this._eventTarget.addEventListener(eventName, callback);
      },
      off(eventName: string, callback: EventListenerOrEventListenerObject) {
        this._eventTarget.removeEventListener(eventName, callback);
      },
      onMessageHandler(evt: MessageEvent) {
        logger("ifc received message event...");
        logger("evt origin:", evt.origin);
        logger("evt source", evt.source);
        logger("evt data", evt.data);
        if (evt.origin !== baseUrl) return;
        if (evt.data === "close") {
          hideZW();
        }
        if (evt.data === "ifc:error") {
          logger("iframe error!");
          this._triggerEvent("error", evt.data); // trigger error event.
        }
        if (evt.data === "ifc:ready") {
          logger("iframe ready...");
          handleWidgetConfig(widgetConfig);
        }
        if (evt.data === "ifc:ack") {
          handleAcknowledge(); // `start` customer is authenticated.
          this._triggerEvent("ready", null); // trigger ready event.
        }
      },
      init() {
        if (typeof initConfig !== "object" || !initConfig.widgetId) {
          throw new Error("Invalid configuration. widgetId is required.");
        }

        const externalId = initConfig?.customer?.externalId || null;
        const email = initConfig?.customer?.email || null;

        const customerHash = initConfig.customer?.customerHash || null;
        const hasCustomerIdentifier = !!externalId || !!email;

        // Do some checks when setting up the widget.
        if (hasCustomerIdentifier && !customerHash) {
          throw new Error(
            "Invalid configuration. `customerHash` is required when `customerExternalId`, `customerEmail` are provided."
          );
        } else if (!hasCustomerIdentifier && customerHash) {
          throw new Error(
            "Invalid configuration. `customerHash` is required when `customerExternalId`, `customerEmail` are not provided."
          );
        }

        // with defaults
        const customerOpts = customer(initConfig.customer || {});
        const widgetLayoutOpts = widgetLayout(initConfig.layout || {});

        widgetConfig = {
          widgetId: initConfig.widgetId,
          customer: customerOpts,
          layout: widgetLayoutOpts,
        };

        fetchWidgetConfig(initConfig.widgetId)
          .then((c) => {
            logger("fetched widget config", c);
            widgetSdkOpts = sdkOpts(c) as WidgetSdkOpts;
          })
          .then(() => {
            logger("configure widget session...");
            // Check if the `customerHash` is provided.
            // If so, we don't need to generate a sessionId.
            // We will use the customerHash to identify the customer.
            if (customerHash) {
              return Promise.resolve();
            }

            // check if existing sessionId is already stored.
            const [existingSession, getErr] = getLocalStorage(
              initConfig.widgetId
            );
            if (getErr) {
              console.error("Error checking widget session from store", getErr);
            }
            // if sessionId is already stored, use it.
            if (existingSession) {
              widgetConfig.sessionId = existingSession;
              return Promise.resolve();
            }
            // generate a new sessionId, works if there was also an error
            // when trying to get the sessionId from localStorage.
            const newSessionId = generateUUID();
            const [isSet, setErr] = setLocalStorage(
              initConfig.widgetId,
              newSessionId
            );
            if (setErr) {
              console.error("Error storing widget session", setErr);
              return Promise.reject(setErr);
            }
            if (isSet) {
              widgetConfig.sessionId = newSessionId;
            }
            return Promise.resolve();
          })
          .then(() => {
            logger("create iframe widget...");
            createZygWidget(widgetSdkOpts),
              window.addEventListener(
                "message",
                this.onMessageHandler.bind(this)
              ),
              window.addEventListener("resize", handlePageWidthChange);
          })
          .catch((err) => {
            console.error("Error configuring widget", err);
          });
      },
    });
    const z = zyg(initConfig);
    z.init();
    window["Zyg"] = z;
    // dispatch event to notify that the zyg sdk is initialized.
    // globally accessible
    window.dispatchEvent(new Event("zyg:init"));
  })();
}

window["initZygWidgetScript"] = initZygWidgetScript;

declare global {
  interface Window {
    initZygWidgetScript: typeof initZygWidgetScript;
    ZygEnv: string;
    Zyg: ZygSDKInstance;
  }
}
