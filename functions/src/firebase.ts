import * as admin from "firebase-admin";
const serviceAccount = "./permissions.json";

admin.initializeApp({
  // service account allows to connect to the database
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://instareview.firebaseio.com"
});

const db: FirebaseFirestore.Firestore = admin.firestore();
db.settings({ timestampsInSnapshots: true });

export { db, admin };
