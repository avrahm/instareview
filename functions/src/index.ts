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

// Read
// Get

// Update
// Put

// Delete

// Export the api to Firebase Cloud Functions
exports.app = functions.https.onRequest(app);
