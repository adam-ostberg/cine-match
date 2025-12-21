import { observer } from "mobx-react-lite";
import { UserModel } from "../UserModel"
import type { SessionModel } from "../SessionModel";
import { InviteView } from "../views/InviteView";
import { acceptLobbyInvite, declineLobbyInvite } from "../firestoreModel";

type InvitePresenterProps = {
  userModel: UserModel;
  sessionModel: SessionModel;
}

const InvitePresenter = observer(
  function InviteRender(props: InvitePresenterProps) {
    async function handleAcceptInviteACB() {
      await acceptLobbyInvite(props.userModel);
      window.location.hash = "#/lobby";
    }

    async function handleDeclineInviteACB() {
      declineLobbyInvite(props.userModel);
    }

   return props.userModel.invite ? (
      <InviteView 
        fromUsername={props.userModel.invite.fromUsername}
        fromUserId={props.userModel.invite.fromUserId}
        onAcceptInvite={handleAcceptInviteACB}
        onDeclineInvite={handleDeclineInviteACB}
      />
    ) : null;
  }
);

export { InvitePresenter };