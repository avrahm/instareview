import admin from "firebase-admin";
const serviceAccount = "./permissions.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const firestoreDB: FirebaseFirestore.Firestore = admin.firestore();
firestoreDB.settings({ timestampsInSnapshots: true });

export const db = firestoreDB;
