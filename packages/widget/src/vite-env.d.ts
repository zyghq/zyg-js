/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly ZYG_XAPI_URL: string;
  // add more env variables here if needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
