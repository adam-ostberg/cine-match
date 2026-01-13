import { observer } from "mobx-react-lite";
import { LobbyView } from "../views/lobbyView";
import { MovieModel } from "../MovieModel";
import { SessionModel, type UserInfoType } from "../SessionModel";
import { isUserSessionHost } from "../sessionHelpers";
import type { UserModel, FriendType } from "../UserModel";
import { configDataForSwipeStart } from "../helperFunctions";
import { Navbar } from "./navbarPresenter";

export type LobbyPresenterProps = {
  model: MovieModel;
  sessionModel: SessionModel;
  userModel: UserModel;
}

const Lobby = observer(
  function LobbyRender(props: LobbyPresenterProps) {
    
    function handleStartSwipingACB() {
      props.sessionModel.setStatus("active");
      window.location.href = "#/swipe";
    }

    function handleToOptionsViewACB() {
      document.location.href = "#/options"
    }

    function handleInviteFriendACB(friend: FriendType) {
      if (!props.userModel.currentUser && !props.sessionModel.getSessionId) return;
      props.userModel.sendLobbyInviteAction(friend.userId);
    }

    if (props.sessionModel.status === "active") {
      if (!props.sessionModel.hasBeenActivated) {
        props.sessionModel.clearMatchVars();
        props.sessionModel.setHasBeenActivated(true);
        configDataForSwipeStart(props.model);
      }
      window.location.href = "#/swipe";
    }

    // Callback for extracting usernames
    function getUsernamesCB(user: UserInfoType): string {
      return user.username;
    }

    // The list of users usernames in the current session
    const usernames = props.sessionModel.participants.map(getUsernamesCB);

    return (
      <div>
        {<Navbar movieModel={props.model} userModel={props.userModel} sessionModel={props.sessionModel}/>}
        <LobbyView 
          lobbyId={props.userModel.currentSessionId || "No Session"} 
          usernames={usernames} 
          isHost={isUserSessionHost(props.model, props.sessionModel)}
          friends={props.userModel.friends}
          onStartSwiping={handleStartSwipingACB}
          toOptionsView={handleToOptionsViewACB}
          onInviteFriend={handleInviteFriendACB}
        />
      </div>
    );
  }
);

export { Lobby };