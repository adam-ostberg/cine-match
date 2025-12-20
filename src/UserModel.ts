import { type User } from "firebase/auth";
import { handleSwipeInSession } from "./firestoreModel";
import { makeAutoObservable } from "mobx";

export type MatchType = {
    movieId: number;
    title: string;
    poster_path: string | null;
    usersInSession: string[];
}

export type UserModelType = {
    userId: string;
    ready: boolean;
    currentUser: User | null;
    username: string;
    currentSessionId: string | null;
    likes: any[];
    matches: MatchType[];
    setUserId: (userId: string) => void;
    setCurrentUser: (user: User | null) => void;
    setUsername: (username: string) => void;
    setCurrentSessionId: (id: string | null) => void;
    setLikes: (likes: any[]) => void;
    reportSwipe: (movieId: number, title: string, posterPath: string, liked: boolean) => void;
    addMatch: (match: MatchType) => void;
}

export class UserModel  {
    userId = "";
    ready = false;
    currentUser: User | null = null;
    username = "";
    currentSessionId: string | null = null;
    likes: any[] = [];
    matches: any[] = [];

    constructor() {
        makeAutoObservable(this);
    }

    setUserId(userId: string) {
        this.userId = userId;
    }

    // For updating the current authenticated user, done via auth observer
    setCurrentUser(user: User | null) {
        this.currentUser = user;
    }

    setUsername(username: string) {
        this.username = username;
    }

    setCurrentSessionId(id: string | null) {
        this.currentSessionId = id;
    }

    setLikes(likes: any[]) {
        this.likes = likes;
    }
    
    async reportSwipe(movieId: number, title: string, posterPath: string, liked: boolean) {
        if (this.currentSessionId && this.userId) {
            const didMatch = await handleSwipeInSession(this.currentSessionId, this, {id: movieId, title, posterPath}, liked);
            if (didMatch) {
                // TODO: Remove this!
                console.log("A match was made for movie:", title);
            }
        }
    }

    addMatch(match: MatchType) {
        this.matches = [...this.matches, match];
    }
}