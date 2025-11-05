import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAnalytics, Analytics } from "firebase/analytics";
import { getRemoteConfig, RemoteConfig } from "firebase/remote-config";

// Firebase 설정
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Firebase 앱 초기화 (중복 초기화 방지)
let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Analytics 인스턴스 (클라이언트 사이드에서만 사용 가능)
let analytics: Analytics | null = null;

// Remote Config 인스턴스 (클라이언트 사이드에서만 사용 가능)
let remoteConfig: RemoteConfig | null = null;

// 브라우저 환경에서만 Analytics와 Remote Config 초기화
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
  remoteConfig = getRemoteConfig(app);

  remoteConfig.settings.minimumFetchIntervalMillis = 2000;
}

export { app, analytics, remoteConfig };
