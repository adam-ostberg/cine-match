import { MovieModel } from "./MovieModel";
import { SessionModel } from "./SessionModel";

export function isUserSessionHost(model: MovieModel, sessionModel: SessionModel): boolean {
    // If no user or no host, return false
    if (!model.userId || !sessionModel.hostId) {
        return false;
    }

    // If the current sessions hostId matches the userId then this client is the host
    if (model.userId === sessionModel.hostId) {
        return true;
    }

    // Otherwise return false as we are not the host
    return false;
}
