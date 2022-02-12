import admin from "firebase-admin";
const serviceAccount = "./permissions.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
