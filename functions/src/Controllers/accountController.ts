import { Response } from "express";
import { db } from "../firebase";

type AccountType = {
    username: string;
    platform: string;
    createdAt: Date;
    lastUpdatedAt: Date;
    createdBy: string;
    realname: string;
    overallrating: number;
    status: number // status: 0 - inactive, 1 - active, 2 - pending, 3 - banned, 4 - claimed
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
            overallrating: 0,
            createdAt: new Date(),
            lastUpdatedAt: new Date(),
            status: 2 // pending
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
        const document = (await query.get()).data();
        const accountObj = {
            username: req.body.username ? req.body.username : document?.username,
            platform: req.body.platform ? req.body.platform : document?.platform,
            lastUpdatedAt: new Date(),
            realname: req.body.realname ? req.body.realname : document?.realname,
            status: req.body.status ? req.body.status : document?.status,
            lastUpdatedBy: req.user,
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
