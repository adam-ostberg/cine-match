import { auth, db } from "./firebaseConfig";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    type User
} from "firebase/auth";

import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";

import type { UserModelType } from "./UserModel";

// Function for signing up a new user with email and password
export async function signUpWithEmail(userModel: UserModelType, username: string, email: string, password: string) {
    // First create the use in Firebase Auth with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
        username: username,
        email: email,
        createdAt: serverTimestamp(),
    });

    userModel.setCurrentUser(user);
    userModel.setUserId(user.uid);
    userModel.setUsername(username);

    return user;
}

// Sign in an existing user with email and password
export async function signInWithEmail(userModel: UserModelType, email: string, password: string) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Get the signed in users username and update it in the model
    const userDoc = await getDoc(doc(db, "users", user.uid));
    const username = userDoc.data()?.username || "";

    userModel.setUsername(username);
    userModel.setCurrentUser(user);
    userModel.setUserId(user.uid);
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
