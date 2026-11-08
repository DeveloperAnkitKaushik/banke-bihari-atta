import { getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/** Without env vars the site runs on seed data and the admin runs in browser-only demo mode. */
export const isFirebaseConfigured = Boolean(config.apiKey && config.projectId);

export const app = isFirebaseConfigured ? (getApps()[0] ?? initializeApp(config)) : null;
export const db = app ? getFirestore(app) : null;
