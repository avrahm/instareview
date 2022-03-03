import { db } from "../firebase";

export const getDocRef = (collection: string, docId: string): FirebaseFirestore.DocumentReference => {
    return db.collection(collection).doc(docId);
}

export const docExists = async (collection: string, docId: string): Promise<boolean> => {
    const docRef = getDocRef(collection, docId);
    const docRefCheck = await docRef.get();
    return docRefCheck.exists;
}

export const programExists = async (accountId: string, programId: string): Promise<boolean> => {
    const programRef = getDocRef("accounts", accountId).collection("programs").doc(programId);
    const programRefCheck = await programRef.get();
    return programRefCheck.exists;
}