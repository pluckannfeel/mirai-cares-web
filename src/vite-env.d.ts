/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SOME_ENV_VARIABLE: string;
  // ... define other environment variables here
  // Add BASE_URL property
  readonly BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
