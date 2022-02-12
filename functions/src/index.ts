import cors from "cors";
import express, { Request, Response } from "express";
import * as functions from "firebase-functions";
import admin from "./fb-admin";

const app = express();

// Automatically allow cross-origin requests.
// Allow any domain that requests a resource from my server
app.use(cors({ origin: true }));

const db = admin.firestore();

// Routes
app.get("/hello-world", (req: Request, res: Response) => {
    return res.status(200).send("Hello World!");
});

// Create Account
// Post
app.post("/api/create", async (req: Request, res: Response) => {
    try {
        await db.collection("accounts").doc().create({
            username: req.body.username,
            platform: req.body.platform,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            lastUpdatedAt: admin.firestore.FieldValue.serverTimestamp(),
            createdBy: req.body.createdBy || "",
            realname: req.body.realname || "",
        });
        return res.status(200).send("Account created!")
    } catch (error) {
        return res.status(500).send(error)
    }
});

// Read an account by id
// Get
app.get("/api/account/:id", async (req: Request, res: Response) => {
    try {
        const document = db.collection("accounts").doc(req.params.id);
        const account = await document.get();
        const response = account.data();

        return res.status(200).send(response)
    } catch (error) {
        return res.status(500).send(error)
    }
});

// Read all the accounts
// Get
app.get("/api/accounts", async (req: Request, res: Response) => {
    try {
        const query = db.collection("accounts");
        const response: FirebaseFirestore.DocumentData[] = [];

        await query.get().then(snapshot => {
            const docs = snapshot.docs; // the result of the query
            docs.forEach(doc => {
                const eachDoc = {
                    id: doc.id,
                    ...doc.data()
                }
                response.push(eachDoc);
            });
        });

        return res.status(200).send(response)
    } catch (error) {
        return res.status(500).send(error)
    }
});

// Update
// Put

// Delete

// Export the api to Firebase Cloud Functions
exports.app = functions.https.onRequest(app);
