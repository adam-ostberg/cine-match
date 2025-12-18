import { type User } from "firebase/auth";

export type UserModelType = {
    userId: string;
    ready: boolean;
    currentUser: User | null;
    username: string;
    currentSessionId: string | null;
    setUserId: (userId: string) => void;
    setCurrentUser: (user: User | null) => void;
    setUsername: (username: string) => void;
    setCurrentSessionId: (id: string | null) => void;
}

export const UserModel: UserModelType = {
    userId: "",
    ready: false,
    currentUser: null as User | null,
    username: "",
    currentSessionId: null,

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
}