import cors from "cors";
import express from "express";
import * as functions from "firebase-functions";
import { createAccount, getAccountById, getAllAccounts, updateAccount } from "./accountController";
import FirebaseAuthToken from "./Middleware/firebaseAuthToken";

const app = express();

// Automatically allow cross-origin requests.
// Allow any domain that requests a resource from my server
app.use(cors({ origin: true }));

const firebaseAuthToken = new FirebaseAuthToken().decodeToken;

// Routes

// Create Account
// Post
app.post("/api/account", firebaseAuthToken, createAccount);

// Read an account by id
// Get
app.get("/api/account/:id", getAccountById);

// Read all the accounts
// Get
app.get("/api/accounts", getAllAccounts);

// Update
// Put
app.put("/api/account/:id", firebaseAuthToken, updateAccount);

// Delete

// Export the api to Firebase Cloud Functions
exports.app = functions.https.onRequest(app);
