import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

function getFirebaseAdminApp() {
  if (admin.apps.length > 0) {
    return admin.apps[0]!;
  }

  // 1. Try loading direct Service Account JSON file if present
  try {
    const serviceAccountPath = path.join(process.cwd(), 'src', 'lib', 'firebase-service-account.json');
    if (fs.existsSync(serviceAccountPath)) {
      const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
      return admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }
  } catch (e) {
    console.warn('[FirebaseAdmin] Failed to load firebase-service-account.json:', e);
  }

  // 2. Try loading from environment variables
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

  if (privateKey) {
    privateKey = privateKey.replace(/\\n/g, '\n');
  }

  if (projectId && clientEmail && privateKey) {
    return admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  }

  // 3. Fallback / default app initialization
  return admin.initializeApp({
    projectId: projectId || 'sw-gyanmitra-finall2-426-dcc41',
  });
}

const adminApp = getFirebaseAdminApp();
const adminDb = admin.firestore(adminApp);
const adminAuth = admin.auth(adminApp);
const adminMessaging = admin.messaging(adminApp);

export { adminApp, adminDb, adminAuth, adminMessaging };

