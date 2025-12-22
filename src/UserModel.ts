import { type User } from "firebase/auth";
import { makeAutoObservable } from "mobx";

export type FriendType = {
    userId: string;
    username: string;
}

export type MatchType = {
    movieId: number;
    title: string;
    poster_path: string | null;
    usersInSession: string[];
}

export type FriendRequestType = {
    fromUserId: string;
    fromUsername: string;
    status: "pending" | "accepted" | "rejected";
}

export type InviteType = {
    fromUserId: string;
    fromUsername: string;
    sessionId: string;
    sentAt: Date;
}

export class UserModel  {
    userId = "";
    ready = false;
    currentUser: User | null = null;
    username = "";
    currentSessionId: string | null = null;
    likes: any[] = [];
    matches: any[] = [];
    invite: InviteType | null = null;
    friends: FriendType[] = [];
    friendRequests: FriendRequestType[] = [];
    // Pending actions for persistence via side effects
    pendingSessionSwipe: { movieId: number; title: string; posterPath: string } | null = null;
    pendingFriendRequest: { toUsername: string } | null = null;
    pendingAcceptFriendRequest: { fromUserId: string; fromUsername: string } | null = null;
    pendingLobbyInvite: { toUserId: string } | null = null;
    pendingCreateSession: boolean = false;
    pendingJoinSession: { sessionId: string } | null = null;
    pendingAcceptLobbyInvite: boolean = false;
    pendingDeclineLobbyInvite: boolean = false;

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

    setReady(value: boolean) {
        this.ready = value;
    }

    setMatches(newMatches: any[]) {
        this.matches = newMatches;
    }

    setFriends(newFriends: FriendType[]) {
        this.friends = newFriends;
    }

    setFriendRequests(requests: FriendRequestType[]) {
        this.friendRequests = requests;
    }

    setInvite(invite: InviteType | null) {
        this.invite = invite;
    }

    removeInvite() {
        this.invite = null;
    }
    
    reportSwipe(movieId: number, title: string, posterPath: string, liked: boolean) {
        // Only add likes and only if the user is in a session
        if(!liked || !this.currentSessionId || !this.userId) return;

        // Add the like to the model
        const alreadyLiked = this.likes.some(m => m.movieId === movieId);
        if (!alreadyLiked) {
            this.likes = [...this.likes, {movieId: movieId, title: title, poster_path: posterPath}];
        }

        // Set pending swipe for sesesion matching logic
        this.pendingSessionSwipe = { movieId, title, posterPath };
    }

    clearPendingSessionSwipe() {
        this.pendingSessionSwipe = null;
    }

    // Friend request actions
    sendFriendRequest(toUsername: string) {
        this.pendingFriendRequest = { toUsername };
    }

    clearPendingFriendRequest() {
        this.pendingFriendRequest = null;
    }

    acceptFriendRequestAction(fromUserId: string, fromUsername: string) {
        this.pendingAcceptFriendRequest = { fromUserId, fromUsername };
    }

    clearPendingAcceptFriendRequest() {
        this.pendingAcceptFriendRequest = null;
    }

    // Lobby invite actions
    sendLobbyInviteAction(toUserId: string) {
        this.pendingLobbyInvite = { toUserId };
    }

    clearPendingLobbyInvite() {
        this.pendingLobbyInvite = null;
    }

    // Session actions
    createSessionAction() {
        this.pendingCreateSession = true;
    }

    clearPendingCreateSession() {
        this.pendingCreateSession = false;
    }

    joinSessionAction(sessionId: string) {
        this.pendingJoinSession = { sessionId };
    }

    clearPendingJoinSession() {
        this.pendingJoinSession = null;
    }

    // Accept/Decline lobby invite actions
    acceptLobbyInviteAction() {
        this.pendingAcceptLobbyInvite = true;
    }

    clearPendingAcceptLobbyInvite() {
        this.pendingAcceptLobbyInvite = false;
    }

    declineLobbyInviteAction() {
        this.pendingDeclineLobbyInvite = true;
    }

    clearPendingDeclineLobbyInvite() {
        this.pendingDeclineLobbyInvite = false;
    }

    addMatch(match: MatchType) {
        // First we prevent duplicate matches by checking existing IDs
        const existingIds = this.matches.map(m => m.movieId);
        if (existingIds.includes(match.movieId)) return; 

        // If the movie hasnt been matched before we add it to the list of users macthed movies
        this.matches = [...this.matches, match];
    }

    addFriend(friend: FriendType) {
        this.friends = [...this.friends, friend];
    }

    addFriendRequest(request: FriendRequestType) {
        // Add new friend request if it already doesn't exist
        if (!this.friendRequests.find(r => r.fromUserId === request.fromUserId)) {
            this.friendRequests = [...this.friendRequests, request];
        }
    }

    removeFriendRequest(userId: string) {
        this.friendRequests = this.friendRequests.filter(r => r.fromUserId !== userId);
    }

    acceptFriendRequest(userId: string, username: string) {
        this.removeFriendRequest(userId);
        this.addFriend({userId, username});
    }
}
