"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const functions = __importStar(require("firebase-functions"));
const firebase_1 = require("./firebase");
const app = express_1.default();
// Automatically allow cross-origin requests.
// Allow any domain that requests a resource from my server
app.use(cors_1.default({ origin: true }));
// Routes
app.get("/hello-world", (req, res) => {
    return res.status(200).send("Hello World!");
});
// Create Account
// Post
app.post("/api/account", async (req, res) => {
    try {
        await firebase_1.db.collection("accounts").doc().create({
            username: req.body.username,
            platform: req.body.platform,
            createdAt: new Date(),
            lastUpdatedAt: new Date(),
            createdBy: req.body.createdBy || "",
            realname: req.body.realname || "",
        });
        return res.status(200).send("Account created!");
    }
    catch (error) {
        return res.status(500).send(error);
    }
});
// Read an account by id
// Get
app.get("/api/account/:id", async (req, res) => {
    try {
        const document = firebase_1.db.collection("accounts").doc(req.params.id);
        const account = await document.get();
        const response = account.data();
        return res.status(200).send(response);
    }
    catch (error) {
        return res.status(500).send(error);
    }
});
// Read all the accounts
// Get
app.get("/api/accounts", async (req, res) => {
    try {
        const query = firebase_1.db.collection("accounts");
        const response = [];
        await query.get().then(snapshot => {
            const docs = snapshot.docs; // the result of the query
            docs.forEach(doc => {
                const eachDoc = Object.assign({ id: doc.id }, doc.data());
                response.push(eachDoc);
            });
        });
        return res.status(200).send(response);
    }
    catch (error) {
        return res.status(500).send(error);
    }
});
// Update
// Put
app.put("/api/account/:id", async (req, res) => {
    try {
        const document = firebase_1.db.collection("accounts").doc(req.params.id);
        await document.update({
            username: req.body.username,
            platform: req.body.platform,
            lastUpdatedAt: new Date(),
            realname: req.body.realname || "",
        });
        return res.status(200).send("Account updated!");
    }
    catch (error) {
        return res.status(500).send(error);
    }
});
// Delete
// Export the api to Firebase Cloud Functions
exports.app = functions.https.onRequest(app);
//# sourceMappingURL=index.js.map