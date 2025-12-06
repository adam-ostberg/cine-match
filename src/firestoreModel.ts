import { db } from "./firebaseConfig.ts";
import { type ModelType } from "./MovieModel.ts";
import { doc, setDoc, getDoc } from "firebase/firestore";

// Create a new session in Firebase and return the session ID
export async function createSession(model: ModelType) {
    // Generate a random 6-digit code or use a UUID
    const sessionId = Math.floor(100000 + Math.random() * 900000).toString();
    
    const docRef = doc(db, "sessions", sessionId);
    // Try to create the doc in firestore, throw error if it fails
    try {
        await setDoc(docRef, {
            status: "waiting",
            match: null,
            created: new Date(),
        });
        console.log("Session created successfully with ID:", sessionId);
    } catch (error) {
        console.error("Error creating session:", error);
        throw error;
    }

    // Set and return the session ID
    model.setSessionId(sessionId);
    console.log("Session created with ID: ", sessionId);
    return sessionId;
}

export async function joinSession(model: ModelType, sessionId: string) {
    const docRef = doc(db, "sessions", sessionId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        model.setSessionId(sessionId);
        console.log("Joined session with ID:", sessionId);
        return true;
    } else {
        alert("Session ID not found.");
    }
}