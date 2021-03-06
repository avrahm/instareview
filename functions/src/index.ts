import cors from "cors";
import express from "express";
import * as functions from "firebase-functions";
import { reviewController } from "./Controllers";
import { createAccount, getAccountById, getAllAccounts, updateAccount } from "./Controllers/accountController";
import { addProgram, getAllProgramsByAccount, updateProgram } from "./Controllers/programController";
import FirebaseAuthToken from "./Middleware/firebaseAuthToken";

const app = express();

// Automatically allow cross-origin requests.
// Allow any domain that requests a resource from my server
app.use(cors({ origin: true }));

const firebaseAuthToken = new FirebaseAuthToken().decodeToken;

// Routes

// Create Account - Post
app.post("/api/account", firebaseAuthToken, createAccount);

// Read an account by id - Get
app.get("/api/account/:id", getAccountById);

// Read all the accounts - Get
app.get("/api/accounts", getAllAccounts);

// Update - Put
app.put("/api/account/:id", firebaseAuthToken, updateAccount);

// Delete
// Delete Account (?)

// Add a Program on an account
app.post("/api/program", firebaseAuthToken, addProgram)

// Update a Program on an account
app.put("/api/program", firebaseAuthToken, updateProgram)

// Get all the programs on an account
app.get("/api/program/:accountId", getAllProgramsByAccount);

// Add a review
app.post("/api/review", firebaseAuthToken, reviewController.addReview)

// update a review
app.put("/api/review", firebaseAuthToken, reviewController.updateReview)

// Get all reviews for an account
app.get("/api/reviews/:accountId", reviewController.getAllReviewsByAccount)

// Get all reviews for a program
app.get("/api/reviews/:accountId/:programId", reviewController.getAllReviewsByProgram)

// Get all review by user
app.get("/api/user/reviews", firebaseAuthToken, reviewController.getAllReviewsByUser)

// Export the api to Firebase Cloud Functions
exports.app = functions.https.onRequest(app);
