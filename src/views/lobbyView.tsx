
export type LobbyViewProps = {
  lobbyId: string;
  usernames: string[];
  isHost: boolean;
  onStartSwiping: () => void;
  toOptionsView: () => void;
}

export function LobbyView(props: LobbyViewProps) {
  
  function startSwipingACB() {
    props.onStartSwiping();
  }
  function toOptionsViewACB() {
    props.toOptionsView();
  }

  return (
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
