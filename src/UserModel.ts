import { type User } from "firebase/auth";
import { handleSwipeInSession } from "./firestoreModel";

export type UserModelType = {
    userId: string;
    ready: boolean;
    currentUser: User | null;
    username: string;
    currentSessionId: string | null;
    likes: any[];
    setUserId: (userId: string) => void;
    setCurrentUser: (user: User | null) => void;
    setUsername: (username: string) => void;
    setCurrentSessionId: (id: string | null) => void;
    setLikes: (likes: any[]) => void;
    reportSwipe: (movieId: number, title: string, posterPath: string, liked: boolean) => void;
}

export const UserModel: UserModelType = {
    userId: "",
    ready: false,
    currentUser: null as User | null,
    username: "",
    currentSessionId: null,
    likes: [],

    setUserId(userId: string) {
        this.userId = userId;
    },

    // For updating the current authenticated user, done via auth observer
    setCurrentUser(user: User | null) {
        this.currentUser = user;
    },

    setUsername(username: string) {
        this.username = username;
    },

    setCurrentSessionId(id: string | null) {
        this.currentSessionId = id;
    },

    setLikes(likes: any[]) {
        this.likes = likes;
    },
    
    async reportSwipe(movieId: number, title: string, posterPath: string, liked: boolean) {
        if (this.currentSessionId && this.userId) {
            await handleSwipeInSession(this.currentSessionId, this, {id: movieId, title, posterPath}, liked);
        }
    },
}