export type LikesType = {
    moveId: string[];
}

export type UserInfoType = {
    userId: string;
    username: string;
}

export type SessionType = {
    ready: boolean;
    sessionId: string | null;
    created: string;
    hostId: string;
    status: "waiting" | "active" | "matched";
    participants: UserInfoType[];
    likes: LikesType[];
    setSessionId: (sessionId: string | null) => void;
    getSessionId: () => string | null;
    setStatus: (status: "waiting" | "active" | "matched", userId: string) => void;
    addUser: (user: UserInfoType) => void;
}

export const SessionModel: SessionType = {
    ready: false,
    sessionId: null,
    created: "",
    hostId: "",
    status: "waiting",
    participants: [],
    likes: [],

    setSessionId(sessionId: string | null) {
        this.sessionId = sessionId;
    },

    getSessionId() {
        return this.sessionId;
    },

    setStatus(status: "waiting" | "active" | "matched", userId: string) {
        if (this.hostId !== userId) return; // Only host can change status
        this.status = status;
    },

    addUser(user: UserInfoType) {
        if (!this.participants.find(u => u.userId === user.userId)) {
            this.participants.push(user);
        }
    }
}
