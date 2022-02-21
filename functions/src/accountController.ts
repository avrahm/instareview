import { Response } from "express";
import { db } from "./firebase";

type AccountType = {
    username: string;
    platform: string;
    createdAt: Date;
    lastUpdatedAt: Date;
    createdBy: string;
    realname: string;
    overallrating: number;
}

type Request = {
    body: AccountType,
    user?: string,
    params: {
        id: string
    }
}

// Create Account
// Post
const createAccount = async (req: Request, res: Response): Promise<unknown> => {
    try {
        const query = db.collection("accounts").doc()
        const accountObj = {
            id: query.id,
            username: req.body.username,
            platform: req.body.platform,
            createdBy: req.user,
            realname: req.body.realname,
            overallrating: req.body.overallrating,
            createdAt: new Date(),
            lastUpdatedAt: new Date(),
        }

        await query.create(accountObj);

        return res.status(200).send({
            status: "success",
            message: "Account created!",
            data: accountObj
        })
    } catch (error) {
        let errorMessage = "Unknown error";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return res.status(500).send({ errorMessage });
    }
};

const getAccountById = async (req: Request, res: Response): Promise<unknown> => {
    try {
        const query = db.collection("accounts").doc(req.params.id);
        const response = (await query.get()).data();
        return res.status(200).send(response)
    } catch (error) {
        let errorMessage = "Unknown error";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return res.status(500).send({ errorMessage });
    }
}

const getAllAccounts = async (req: Request, res: Response): Promise<unknown> => {
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
        let errorMessage = "Unknown error";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return res.status(500).send({ errorMessage });
    }
}

const updateAccount = async (req: Request, res: Response): Promise<unknown> => {
    try {
        const query = db.collection("accounts").doc(req.params.id);
        const accountObj = {
            username: req.body.username,
            platform: req.body.platform,
            lastUpdatedAt: new Date(),
            realname: req.body.realname || "",
            overallrating: req.body.overallrating || 0,
        };

        await query.update(accountObj)

        return res.status(200).send({
            status: "success",
            message: "Account updated!",
            data: accountObj
        })
    }
    catch (error) {
        let errorMessage = "Unknown error";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return res.status(500).send({ errorMessage });
    }
}

export { createAccount, getAccountById, getAllAccounts, updateAccount };
