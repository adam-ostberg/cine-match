import { observer } from "mobx-react-lite";
import { LobbyView } from "../views/lobbyView";
import type { ModelType } from "../MovieModel";
import type { SessionType, UserInfoType } from "../SessionModel";
import { isUserSessionHost } from "../sessionHelpers";

export type LobbyPresenterProps = {
  model: ModelType;
  sessionModel: SessionType
}

const Lobby = observer(
  function LobbyRender(props: LobbyPresenterProps) {

    function handleStartSwipingACB() {
      props.sessionModel.setStatus("active", props.model.userId || "");
      window.location.href = "/#swipe";
    }

    if (props.sessionModel.status === "active") {
      window.location.href = "/#swipe";
    }

    // Callback for extracting usernames
    function getUsernamesCB(user: UserInfoType): string {
      return user.username;
    }

    // The list of users usernames in the current session
    const usernames = props.sessionModel.participants.map(getUsernamesCB);

    return (
      <div>
        <LobbyView 
          lobbyId={props.model.getCurrentSessionId() || "No Session"} 
          usernames={usernames} 
          isHost={isUserSessionHost(props.model, props.sessionModel)}
          onStartSwiping={handleStartSwipingACB}
        />
      </div>
    );
  }
);

export { Lobby };