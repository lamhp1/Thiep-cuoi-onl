import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { initializeFirestore, getFirestore, Firestore, setLogLevel } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import firebaseAppletConfig from '../../firebase-applet-config.json';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null,
  authInstance?: Auth | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: authInstance?.currentUser?.uid || null,
      email: authInstance?.currentUser?.email || null,
      emailVerified: authInstance?.currentUser?.emailVerified || null,
      isAnonymous: authInstance?.currentUser?.isAnonymous || null,
      tenantId: authInstance?.currentUser?.tenantId || null,
      providerInfo:
        authInstance?.currentUser?.providerData?.map((p) => ({
          providerId: p.providerId,
          email: p.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Config resolution: prioritize firebase-applet-config.json, then check Vite environment variables
const metaEnv = (import.meta as unknown as { env?: Record<string, string | undefined> })?.env || {};

const configFromJson = firebaseAppletConfig as {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
  firestoreDatabaseId?: string;
};

const activeConfig = {
  apiKey: configFromJson.apiKey || metaEnv.VITE_FIREBASE_API_KEY,
  authDomain: configFromJson.authDomain || metaEnv.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: configFromJson.projectId || metaEnv.VITE_FIREBASE_PROJECT_ID,
  storageBucket: configFromJson.storageBucket || metaEnv.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: configFromJson.messagingSenderId || metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: configFromJson.appId || metaEnv.VITE_FIREBASE_APP_ID,
  firestoreDatabaseId: configFromJson.firestoreDatabaseId,
};

export const isFirebaseConfigured = Boolean(
  activeConfig.apiKey &&
  activeConfig.projectId &&
  !activeConfig.apiKey.includes('your-')
);

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;

if (isFirebaseConfigured) {
  try {
    setLogLevel('silent');
    app = getApps().length > 0 ? getApps()[0] : initializeApp(activeConfig);
    const dbId = (activeConfig.firestoreDatabaseId && activeConfig.firestoreDatabaseId !== '(default)')
      ? activeConfig.firestoreDatabaseId
      : undefined;

    try {
      db = initializeFirestore(app, {
        experimentalAutoDetectLongPolling: true,
      }, dbId);
    } catch {
      db = dbId ? getFirestore(app, dbId) : getFirestore(app);
    }

    auth = getAuth(app);
    console.log('✨ Firebase initialized successfully for project:', activeConfig.projectId, 'Database:', activeConfig.firestoreDatabaseId || '(default)');
  } catch (err) {
    console.warn('Firebase initialization error, fallback to local storage mode:', err);
  }
}

export { app, db, auth };
