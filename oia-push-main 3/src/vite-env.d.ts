/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MONETRIX_API_URL: string;
  readonly VITE_MONETRIX_PUBLIC_KEY: string;
  readonly VITE_MONETRIX_SECRET_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
