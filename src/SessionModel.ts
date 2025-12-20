import { makeAutoObservable } from "mobx";

export type LikesType = {
    moveId: string[];
}

export type UserInfoType = {
    userId: string;
    username: string;
}

export class SessionModel {
    ready = false;
    sessionId: string | null = null;
    created = "";
    hostId = "";
    status: "waiting" | "active" | "matched" = "waiting";
    hasBeenActivated = false;

    participants: UserInfoType[] = [];
    likes: number[] = [];

    showMatchAnimation = false;
    currentMatchId: number | null = null;

    matchQueue: number[] = [];
    matchesIds: number[] = [];

    constructor() {
        makeAutoObservable(this);
    }

    setSessionId(sessionId: string | null) {
        this.setHasBeenActivated(false);
        this.sessionId = sessionId;
    }

    getSessionId() {
        return this.sessionId;
    }

    setStatus(status: "waiting" | "active" | "matched") {
        this.status = status;
    }

    setHostId(id: string) {
        this.hostId = id;
    }

    addUser(user: UserInfoType) {
        if (!this.participants.find(u => u.userId === user.userId)) {
            this.participants.push(user);
        }
    }

    setReady(value: boolean) {
        this.ready = value;
    }

    setParticipants(participants: UserInfoType[]) {
        this.participants = participants;
    }

    setLikes(likes: number[]) {
        this.likes = likes;
    }
    
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
    }

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
    }

    setHasBeenActivated(value: boolean) {
        this.hasBeenActivated = value;
    }
}
