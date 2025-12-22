import { UserAvatar } from "../components/UserAvatar";
import type { FriendType } from "../UserModel";

export type LobbyViewProps = {
  lobbyId: string;
  usernames: string[];
  isHost: boolean;
  friends: FriendType[];
  onStartSwiping: () => void;
  toOptionsView: () => void;
  onInviteFriend: (friend: FriendType) => void;
}

export function LobbyView(props: LobbyViewProps) {
  
  function startSwipingACB() {
    props.onStartSwiping();
  }

  function toOptionsViewACB() {
    props.toOptionsView();
  }

  function inviteFriendClickACB(friend: FriendType) {
    props.onInviteFriend(friend);
  }

  function FriendsList(friends: FriendType[]) {
    const availableFriends = friends.filter(friend => !props.usernames.includes(friend.username));
    
    if (availableFriends.length === 0) {
      return null;
    }

    return (
      <div className="friends-list-container">
        <h3>Invite Friends</h3>
        <div className="friends-list">
          {availableFriends.map((friend) => (
            <div key={friend.userId} className="friend-item">
              <UserAvatar userId={friend.userId} size={40}/>
              <p>{friend.username}</p>
              <button className="secondary-button" onClick={() => inviteFriendClickACB(friend)}>Invite</button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="lobby-wrapper">
      <div className="lobby-container">
        <div className="lobby-content">
          <h1>Lobby</h1>
          
          <div className="lobby-code-section">
              <p>Lobby Code</p>
              <div className="lobby-code">{props.lobbyId}</div>
          </div>

          <div className="lobby-users-section">
              <p>Connected Users ({props.usernames.length})</p>
              <Userlist usernames={props.usernames} />
          </div>

          
          <div className="lobby-actions">
              <button className="primary-button gray-button" onClick={toOptionsViewACB}>Filter Movie Algoritm</button>
              {props.isHost ? (
                  <button className="primary-button" onClick={startSwipingACB}>Begin Swiping</button>
              ) : (
                  <p className="waiting-text">Waiting for host to start...</p>
              )}
          </div>
        </div>
      </div>
      {FriendsList(props.friends)}
    </div>
  );
}

function Userlist({usernames}: {usernames: string[]}) {
  return (
    <ul className="user-list">
      {usernames.map((username, index) => (
        <li key={index}>{username}</li>
      ))}
    </ul>
  );
}
