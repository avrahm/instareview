import { Response } from "express";
import { db } from "../firebase";

type ProgramType = {
    programId: string;
    accountId: string;
    programInfo: {
        name: string;
        description: string;
        url: string;
    };
    reviewCount: number;
    ratingAverage: number;
    cost: number;
    createdAt: Date;
    createdBy: string;
    type: string[];
    subtype: string[];
    status: number; // status: 0 - inactive, 1 - active, 2 - pending, 3 - removed
}

type Request = {
    body: ProgramType,
    user?: string,
    params: {
        accountId?: string,
        programId?: string
    }
}

// add Program
// Post
const addProgram = async (req: Request, res: Response): Promise<unknown> => {
    if (!req.body.accountId) {
        return res.status(400).send({
            status: "error",
            message: "Missing accountId"
        })
    }
    try {
        const accountRef = db.collection("accounts").doc(req.body.accountId)
        const accountRefCheck = await accountRef.get();
        if (!accountRefCheck.exists) {
            return res.status(400).send({
                status: "error",
                message: "Account doesn't exist!"
            })
        }
        const programRef = accountRef.collection("programs").doc();
        const programObj = {
            programId: programRef.id,
            programInfo: {
                name: req.body.programInfo.name,
                description: req.body.programInfo.description,
                url: req.body.programInfo.url,
            },
            reviewCount: 0,
            ratingAverage: 0,
            cost: req.body.cost,
            createdBy: req.user,
            createdAt: new Date(),
            lastUpdatedAt: new Date(),
            status: 2 // pending
        }

        await programRef.create(programObj);

        return res.status(200).send({
            status: "success",
            message: "Program created!",
            data: programObj
        })
    } catch (error) {
        let errorMessage = "Unknown error";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return res.status(500).send({ errorMessage });
    }
};

const getAllProgramsByAccount = async (req: Request, res: Response): Promise<unknown> => {
    if (!req.params.accountId) {
        return res.status(400).send({
            status: "error",
            message: "Missing accountId"
        })
    }
    try {
        const accountRef = db.collection("accounts").doc(req.params.accountId)
        const accountRefCheck = await accountRef.get();
        if (!accountRefCheck.exists) {
            return res.status(400).send({
                status: "error",
                message: "Account doesn't exist!"
            })
        }
        const query = accountRef.collection("programs");
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

const updateProgram = async (req: Request, res: Response): Promise<unknown> => {
    if (!req.body.accountId || !req.body.programId) {
        return res.status(400).send({
            status: "error",
            message: "Missing accountId or programId"
        })
    }
    try {
        const accountRef = db.collection("accounts").doc(req.body.accountId)
        const accountRefCheck = await accountRef.get();
        if (!accountRefCheck.exists) {
            return res.status(400).send({
                status: "error",
                message: "Account doesn't exist!"
            })
        }
        const programRef = accountRef.collection("programs").doc(req.body.programId);
        const document = (await accountRef.get()).data();
        const programObj = {
            programInfo: {
                name: req.body.programInfo.name ? req.body.programInfo.name : document?.programInfo.name,
                description: req.body.programInfo.description ? req.body.programInfo.description : document?.programInfo.description,
                url: req.body.programInfo.url ? req.body.programInfo.url : document?.programInfo.url,
            },
            cost: req.body.cost ? req.body.cost : document?.cost,
            type: req.body.type ? req.body.type : document?.type,
            subtype: req.body.subtype ? req.body.subtype : document?.subtype,
            lastUpdatedAt: new Date(),
            status: req.body.status ? req.body.status : document?.status,
            lastUpdatedBy: req.user,
        };

        await programRef.update(programObj)

        return res.status(200).send({
            status: "success",
            message: "Program updated!",
            data: programObj
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

export { addProgram, getAllProgramsByAccount, updateProgram };
