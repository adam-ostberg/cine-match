
export type LobbyViewProps = {
  lobbyId: string;
  usernames: string[];
  isHost: boolean;
  onStartSwiping: () => void;
}

export function LobbyView(props: LobbyViewProps) {
  
  function startSwipingACB() {
    props.onStartSwiping();
  }

  return (
    <div>
      <h1>Lobby View</h1>
      <p>LobbyId: {props.lobbyId}</p>
      <p>Users in session: </p>
      <Userlist usernames={props.usernames} />
      {props.isHost && <button className="primary-button" onClick={startSwipingACB}>Begin swiping</button>}
    </div>
  );
}

function Userlist({usernames}: {usernames: string[]}) {
  return (
    <ul>
      {usernames.map((username, index) => (
        <li key={index}>{username}</li>
      ))}
    </ul>
  );
}
