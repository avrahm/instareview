import cors from "cors";
import express, { Request, Response } from "express";
import * as functions from "firebase-functions";
import { db } from "./firebase";

const app = express();

// Automatically allow cross-origin requests.
// Allow any domain that requests a resource from my server
app.use(cors({ origin: true }));


// Routes
app.get("/hello-world", (req: Request, res: Response) => {
    return res.status(200).send("Hello World!");
});

// Create Account
// Post
app.post("/api/account", async (req: Request, res: Response) => {
    try {
        await db.collection("accounts").doc().create({
            username: req.body.username,
            platform: req.body.platform,
            createdAt: new Date(),
            lastUpdatedAt: new Date(),
            createdBy: req.body.createdBy || "",
            realname: req.body.realname || "",
            overallrating: req.body.overallrating || 0,
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
app.put("/api/account/:id", async (req: Request, res: Response) => {
    try {
        const document = db.collection("accounts").doc(req.params.id);
        await document.update({
            username: req.body.username,
            platform: req.body.platform,
            lastUpdatedAt: new Date(),
            realname: req.body.realname || "",
        });
        return res.status(200).send("Account updated!")
    }
    catch (error) {
        return res.status(500).send(error)
    }
});


// Delete

// Export the api to Firebase Cloud Functions
exports.app = functions.https.onRequest(app);
