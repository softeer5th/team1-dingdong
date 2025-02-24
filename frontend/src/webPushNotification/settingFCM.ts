// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getMessaging, Messaging } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Firebase 초기화
export const app = initializeApp(firebaseConfig);

export let messaging: Messaging | undefined = undefined;

// Notification API와 서비스 워커 지원 여부 체크
export const isNotificationSupported = "Notification" in window;
const isServiceWorkerSupported = "serviceWorker" in navigator;

if (isNotificationSupported && isServiceWorkerSupported) {
  console.log("서비스 워커와 Notification 지원됨, FCM 사용 가능");
  messaging = getMessaging(app);
} else {
  console.log("Notification 또는 서비스 워커 미지원, FCM 비활성화");
}
