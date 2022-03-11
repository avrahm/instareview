import { Response } from "express";
import { db } from "../firebase";
import { docExists, programExists } from "../helpers/firebaseHelper";

type ReviewType = {
    reviewId: string;
    accountId: string;
    programId: string;
    reviewInfo: {
        title: string;
        description: string;
    };
    rating: number;
    createdAt: Date;
    createdBy: string;
    verification?: {
        isVerified: boolean;
        evidence: string;
    };
    status: number; // status: 0 - inactive, 1 - active, 2 - pending, 3 - removed
}

type Request = {
    body: ReviewType,
    user?: string,
    params: {
        accountId?: string,
        reviewId?: string,
        programId?: string
    }
}

// add Review
export const addReview = async (req: Request, res: Response): Promise<unknown> => {
    if (!req.body.accountId || !req.body.programId) {
        return res.status(400).send({
            status: "error",
            message: "Missing accountId or programId"
        })
    }
    try {
        if (!await docExists("accounts", req.body.accountId)) {
            return res.status(400).send({
                status: "error",
                message: "Account doesn't exist!"
            })
        }
        if (!await programExists(req.body.accountId, req.body.programId)) {
            return res.status(400).send({
                status: "error",
                message: "Program doesn't exist!"
            })
        }
        const reviewRef = db.collection("reviews").doc();
        const reviewObj = {
            reviewId: reviewRef.id,
            accountId: req.body.accountId,
            programId: req.body.programId,
            reviewInfo: {
                name: req.body.reviewInfo.title,
                description: req.body.reviewInfo.description,
            },
            rating: req.body.rating,
            createdBy: req.user,
            createdAt: new Date(),
            lastUpdatedAt: new Date(),
            lastUpdatedBy: req.user,
            status: 2 // pending
        }

        await reviewRef.create(reviewObj);

        return res.status(200).send({
            status: "success",
            message: "Review created!",
            data: reviewObj
        })
    } catch (error) {
        let errorMessage = "Unknown error";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return res.status(500).send({ errorMessage });
    }
};

// get Reviews by accountId
export const getAllReviewsByAccount = async (req: Request, res: Response): Promise<unknown> => {
    if (!req.params.accountId) {
        return res.status(400).send({
            status: "error",
            message: "Missing accountId"
        })
    }
    try {
        if (!await docExists("accounts", req.params.accountId)) {
            return res.status(400).send({
                status: "error",
                message: "Account doesn't exist!"
            })
        }
        const reviewRef = db.collection("reviews");
        const query = reviewRef.where("accountId", "==", req.params.accountId).get();
        const response: FirebaseFirestore.DocumentData[] = [];
        if ((await query).empty) {
            return res.status(200).send({ "status": "success", "message": "No reviews found!" })
        }
        await query.then(snapshot => {
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

// get Reviews by programId
export const getAllReviewsByProgram = async (req: Request, res: Response): Promise<unknown> => {
    if (!req.params.accountId || !req.params.programId) {
        return res.status(400).send({
            status: "error",
            message: "Missing accountId or programId"
        })
    }
    try {
        if (!await docExists("accounts", req.params.accountId)) {
            return res.status(400).send({
                status: "error",
                message: "Account doesn't exist!"
            })
        }
        if (!await programExists(req.params.accountId, req.params.programId)) {
            return res.status(400).send({
                status: "error",
                message: "Program doesn't exist!"
            })
        }
        const reviewRef = db.collection("reviews");
        const query = reviewRef.where("programId", "==", req.params.programId).get();
        const response: FirebaseFirestore.DocumentData[] = [];
        if ((await query).empty) {
            return res.status(200).send({ "status": "success", "message": "No reviews found!" })
        }
        await query.then(snapshot => {
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

// get Reviews by accountId
export const getAllReviewsByUser = async (req: Request, res: Response): Promise<unknown> => {
    if (!req.user) {
        return res.status(400).send({
            status: "Error",
            message: "No user logged in!"
        })
    }
    try {
        const reviewRef = db.collection("reviews");
        const query = reviewRef.where("createdBy", "==", req.user).get();
        const response: FirebaseFirestore.DocumentData[] = [];
        if ((await query).empty) {
            return res.status(200).send({ "status": "success", "message": "No reviews found!" })
        }
        await query.then(snapshot => {
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

export const updateReview = async (req: Request, res: Response): Promise<unknown> => {
    if (!req.body.reviewId) {
        return res.status(400).send({
            status: "error",
            message: "Missing reviewId"
        })
    }
    if (!await docExists("reviews", req.body.reviewId)) {
        return res.status(400).send({
            status: "error",
            message: "Review doesn't exist!"
        })
    }
    try {
        const reviewRef = db.collection("reviews").doc(req.body.reviewId);
        const document = (await reviewRef.get()).data();
        const reviewObj = {
            reviewInfo: {
                title: req.body.reviewInfo.title ? req.body.reviewInfo.title : document?.reviewInfo.title,
                description: req.body.reviewInfo.description ? req.body.reviewInfo.description : document?.reviewInfo.description
            },
            rating: req.body.rating ? req.body.rating : document?.rating,
            lastUpdatedAt: new Date(),
            lastUpdatedBy: req.user,
            status: req.body.status ? req.body.status : document?.status,
        };

        await reviewRef.update(reviewObj)

        return res.status(200).send({
            status: "success",
            message: "Review updated!",
            data: reviewObj
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
