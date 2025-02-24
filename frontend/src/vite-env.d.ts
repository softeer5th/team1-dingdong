/// <reference types="vite/client" />
// vite-env.d.ts

interface ImportMetaEnv {
  VITE_FIREBASE_API_KEY: string;
  VITE_FIREBASE_AUTH_DOMAIN: string;
  VITE_FIREBASE_PROJECT_ID: string;
  VITE_FIREBASE_STORAGE_BUCKET: string;
  VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  VITE_FIREBASE_APP_ID: string;
  VITE_FCM_VAPID_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
