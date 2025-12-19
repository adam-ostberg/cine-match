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
    likes: number[]
    showMatchAnimation: boolean;
    currentMatchId: number | null; // The ID currently being displayed
    matchQueue: number[];
    matchesIds: number[];
    setSessionId: (sessionId: string | null) => void;
    getSessionId: () => string | null;
    setStatus: (status: "waiting" | "active" | "matched", userId: string) => void;
    addUser: (user: UserInfoType) => void;
    queueMatch: (movieId: number) => void; // Adds to queue
    processQueue: () => void;
}

export const SessionModel: SessionType = {
    ready: false,
    sessionId: null,
    created: "",
    hostId: "",
    status: "waiting",
    participants: [],
    likes: [],
    showMatchAnimation: false,
    currentMatchId: null,
    matchQueue: [],
    matchesIds: [],

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
    },

    processQueue() {
        // If there are matches waiting
        if (this.matchQueue.length > 0) {
            // Take the first one out
            const nextId = this.matchQueue.shift();
            if (nextId) {
                this.currentMatchId = nextId;
                this.showMatchAnimation = true;
                
                console.log("Animating match:", nextId);
            }
        } else {
            // No more matches, stop animation
            this.showMatchAnimation = false;
            this.currentMatchId = null;
            console.log("Match queue finished.");
        }
    },

    queueMatch(movieId: number) {
        // Prevent adding duplicates to the queue or current animation (maybe stupid/shallow logic)
        if (this.currentMatchId === movieId || this.matchQueue.includes(movieId)) {
            return;
        }

        console.log("Queueing match for ID:", movieId);
        console.log(this.matchQueue)
        this.matchesIds.push(movieId);
        this.matchQueue.push(movieId);

        // If no animation is currently running, start the loop
        if (!this.showMatchAnimation) {
            this.processQueue();
        }
    },
}
