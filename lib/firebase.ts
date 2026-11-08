import { getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase web config is public by design; firestore.rules is what protects the data.
const config = {
  apiKey: "AIzaSyAlItm4VnUmJYMegQzuwGcjnw5CLeM0Gk0",
  authDomain: "atta-project-7d7aa.firebaseapp.com",
  projectId: "atta-project-7d7aa",
  appId: "1:1061381689246:web:1339743e6183c921e0d08f",
};

export const app = getApps()[0] ?? initializeApp(config);
export const db = getFirestore(app);
