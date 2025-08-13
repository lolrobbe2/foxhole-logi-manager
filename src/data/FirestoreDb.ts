// FirestoreDb.ts
import { initializeApp, FirebaseApp } from 'firebase/app';
import { Firestore, getFirestore } from 'firebase/firestore';

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
}

export default class FirestoreDb {
  private static instance: FirestoreDb | null = null;
  private firestore: Firestore;

  private constructor() {
    const firebaseConfig: FirebaseConfig = {
      apiKey: process.env.FIREBASE_API_KEY as string,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN as string,
      databaseURL: process.env.FIREBASE_DATABASE_URL as string,
      projectId: process.env.FIREBASE_PROJECT_ID as string,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET as string,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID as string,
      appId: process.env.FIREBASE_APP_ID as string,
      measurementId: process.env.FIREBASE_MEASUREMENT_ID as string,
    };

    const app: FirebaseApp = initializeApp(firebaseConfig);
    this.firestore = getFirestore(app);
  }

  public static getInstance(): Firestore {
    if (!FirestoreDb.instance) {
      FirestoreDb.instance = new FirestoreDb();
    }
    return FirestoreDb.instance.firestore;
  }
}

