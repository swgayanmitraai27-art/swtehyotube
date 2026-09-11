import * as admin from 'firebase-admin';

function getFirebaseAdminApp() {
  if (admin.apps.length > 0) {
    return admin.apps[0]!;
  }

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

  // Fallback / default app initialization for local dev or when using Google Cloud application default credentials
  return admin.initializeApp({
    projectId: projectId || 'sw-tech-youtube-auto',
  });
}

const adminApp = getFirebaseAdminApp();
const adminDb = admin.firestore(adminApp);
const adminAuth = admin.auth(adminApp);

export { adminApp, adminDb, adminAuth };
