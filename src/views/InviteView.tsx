import { UserAvatar } from "../components/UserAvatar"

type InviteViewProps = {
  fromUsername: string;
  fromUserId: string;
  onAcceptInvite: () => void;
  onDeclineInvite: () => void;
}

export function InviteView(props: InviteViewProps) {
  return (
    <>
      <div className="invite-backdrop" onClick={props.onDeclineInvite} />
      <div className="invite-notification">
        <UserAvatar userId={props.fromUserId} size={100} />
        <p>{props.fromUsername} invited you to a session!</p>
        <div className="invite-buttons">
          <button className="primary-button" onClick={props.onAcceptInvite}>Accept</button>
          <button className="destructive-button" onClick={props.onDeclineInvite}>Decline</button>
        </div>
      </div>
    </>
  )
}
