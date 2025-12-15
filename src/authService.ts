import { auth, db } from "./firebaseConfig";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    type User
} from "firebase/auth";

import { doc, setDoc, serverTimestamp } from "firebase/firestore";

// Function for signing up a new user with email and password
export async function signUpWithEmail(username: string, email: string, password: string) {
    // First create the use in Firebase Auth with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Set up the new user document in Firestore
    await setDoc(doc(db, "users", user.uid), {
    username: username,
    email,
    createdAt: serverTimestamp(),
    likes: [],
    dislikes: [],
    sessions: []
    });
    return user;
}

// Sign in an existing user with email and password
export async function signInWithEmail(email: string, password: string) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    return user;
}

// Observe authentication state changes
export function observeAuth(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback); // call this once on app start
}

// Sign out the current user
export function signOutUser() {
    return signOut(auth);
}