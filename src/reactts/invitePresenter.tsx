import { observer } from "mobx-react-lite";
import { UserModel } from "../UserModel"
import type { SessionModel } from "../SessionModel";
import { InviteView } from "../views/InviteView";

type InvitePresenterProps = {
  userModel: UserModel;
  sessionModel: SessionModel;
}

const InvitePresenter = observer(
  function InviteRender(props: InvitePresenterProps) {
    function handleAcceptInviteACB() {
      props.userModel.acceptLobbyInviteAction();
    }

    function handleDeclineInviteACB() {
      props.userModel.declineLobbyInviteAction();
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