import "../style.css"
import { getGenres, type TMDBMoviePageResult } from "../apiConfig.ts";
/* npm install react-icons */
import { FaUserCircle } from "react-icons/fa";
import { IconButton } from "@mui/material";
import { UserAvatar } from "../components/UserAvatar.tsx";
import { Navbar } from "../reactts/navbarPresenter.tsx";
import type { UserModel, MatchType, FriendRequestType, FriendType } from "../UserModel.ts";
import type { SessionModel } from "../SessionModel.ts";
import type { MovieModel } from "../MovieModel.ts";
import { CustomTooltip } from "../tooltip.tsx";
import type { LikedMovie } from "../reactts/profilePresenter.tsx";


export type ProfileViewProps = {
  model: MovieModel;
  userModel: UserModel;
  sessionModel: SessionModel;
  likedMovies: LikedMovie[];
  likedMoviesTitles: string[];
  matchedMovies: MatchType[];
  friendRequests: FriendRequestType[];
  friends: FriendType[];

  onUsernameChange: (name: string) => void;
  onRemoveLike: (movie: TMDBMoviePageResult) => void
  onMovieClick: (id: number) => void;
  onSignOutClick: () => void;
  onSendFriendRequest: (friendUsername: string) => void;
  onAcceptFriendRequest: (fromUsername: string, fromUserId: string) => void;
  onSendInvite: (toUserId: string) => void;
}

export function ProfileView(props: ProfileViewProps) {

  const TMDB_BASE_URL = "https://image.tmdb.org/t/p/";
  const POSTER_WIDTH_URL = "w780/";
  const matchedMovies = [...props.matchedMovies];
  const likedMovies = [...props.likedMovies];

  function handleSearchKeyDownACB(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      const input = e.currentTarget;
      props.onUsernameChange(input.value);
      // Clears focus after enterd
      input.blur();
    }
  }

  function handleSaveClickCB() {
    const input = document.getElementById("username-input") as HTMLInputElement;
    if (input) {
      props.onUsernameChange(input.value);
    }
  }

  function signOutClickACB() {
    props.onSignOutClick();
  }

  function sendFriendRequestACB() {
    const friendUsernameInput = document.getElementById("friend-username-input") as HTMLInputElement;
    if (friendUsernameInput) {
      const friendUsername = friendUsernameInput.value.trim();
      props.onSendFriendRequest(friendUsername);
      friendUsernameInput.value = ""; // Clear input after sending request
    }
  }

  function sendInvite(toUserId: string) {
    props.onSendInvite(toUserId);
  }

  function acceptFriendRequestClick(fromUsername: string, fromUserId: string) {
    props.onAcceptFriendRequest(fromUsername, fromUserId);
  }
  const enoughMatches = (props.matchedMovies.length ?? 0) > 0;

  // TODO: Maybe remove this as its not linked to the new system

  function FriendRequestList(friendRequests: FriendRequestType[]) {
    return (
      <div className="friends-list">
        {friendRequests.map((request, index) => (
          <div className="friend-item" key={index}>
            <UserAvatar userId={request.fromUserId} size={60}/>
            <p>{request.fromUsername}</p>
            <button className="secondary-button" onClick={() => acceptFriendRequestClick(request.fromUsername, request.fromUserId)}>Accept</button>
          </div>
        ))}
      </div>
    );
  }

  function FriendsList(friends: FriendType[]) {
    return (
      <div className="friends-list">
        {friends.map((friend, index) => (
          <div className="friend-item" key={index}>
            <UserAvatar userId={friend.userId} size={60}/>
            <p>{friend.username}</p>
            <button className="secondary-button" onClick={() => sendInvite(friend.userId)}>Invite</button>
          </div>
        ))}
      </div>
    );
  }


  function renderLikedMovieCB(movie: TMDBMoviePageResult) {
    if (!movie.poster_path) return null;
    function movieClickACB() {
      props.onMovieClick(movie.id);
    }
    function removeLikeACB(e: React.MouseEvent) {
      e.stopPropagation(); // Prevent triggering the movie click
      if (window.confirm(`Are you sure you want to remove "${movie.title}" from your likes?`)) {
        props.onRemoveLike(movie);
      }
    }
    return (
      <>
        
        <div key={movie.id} className="seed-result-card profile" onClick={movieClickACB}>
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
          />
          <div className="movie-overlay">
            <span className="movie-title">{movie.title}</span>
            <button className="remove-btn" onClick={removeLikeACB}>
              X
            </button>
          </div>
        </div>
      </>
    );
  }

  function MatchCard(match: MatchType, ownUsername: string) {
    const otherUsers = match.usersInSession.filter(username => username !== ownUsername);
    const enoughUsers = (otherUsers.length ?? 0) > 0;
    const participants = enoughUsers 
      ? [(<div className="">Matched with</div>), otherUsers.map(user => (<div>{user}</div>))]
      : [(<div>Matched with</div>), (<div>Yourself</div>)]
    if (participants.length > 5) {
      participants.slice(0, 4).push((<div>...</div>));
    }
    
    return (
      <div className="seed-result-card" key={match.movieId}>
        <CustomTooltip content={participants}>
          <img src={match.poster_path ?? ""} alt={"Poster of " + match.title} onClick={() => props.onMovieClick(match.movieId)}/>
        </CustomTooltip>
      </div>
    );
  }
  function likedMoviesOutput(movie: LikedMovie) {
    const POSTER_URL = TMDB_BASE_URL + POSTER_WIDTH_URL + movie.poster_path;
    return (
      <div className="seed-result-card" key={movie.movieId}>
        <img src={POSTER_URL ?? ""} alt={"Poster of " + movie.title} onClick={() => props.onMovieClick(Number(movie.movieId))}/>
      </div>
    );
  }

  return (props.userModel.username ? (
    <>
      <Navbar userModel={props.userModel} sessionModel={props.sessionModel}/>
      <div className="scroll-auto">
        <div className="profile-container">
          <h2>My Profile</h2>
          <div className="section profile-header">
            <IconButton>
              {props.userModel.userId ? <UserAvatar
                userId={props.userModel.userId}
                className="profile-pic"
                size={100}
              />
                :
                <FaUserCircle size={100} className="no-name" />}
            </IconButton>
            <div className="profile-info">
              <span className="username">{props.userModel.username}</span>
              <button className="secondary-button" onClick={signOutClickACB}>Sign Out</button>
              <div className="search-row">
                <input
                  id="username-input"
                  className="username-input"
                  type="text"
                  placeholder="Change username"
                  onKeyDown={handleSearchKeyDownACB}
                />
                <button className="secondary-button" onClick={handleSaveClickCB}>
                  Save
                </button>
              </div>
            </div>
          </div>
          <div className="section">
            <h3>Friends</h3>
            {props.friendRequests.length === 0 ? (
              <p>No pending friend requests...</p>
            ) : (
              <div className="friend-requests-list">
                <p>Friend requests</p>
                {FriendRequestList(props.friendRequests)}
              </div>
            )}
            <div className="add-friend-section">
              <h4>Add friend:</h4>
              <div className="add-friend-input">
                <input id="friend-username-input" className="username-input" type="text" placeholder="Friend's username" />
                <button className="secondary-button" onClick={sendFriendRequestACB}>Send request</button>
              </div>
              <h4>Current friends</h4>
              {FriendsList(props.friends)}
            </div>
          </div>
          <div className="section">
            <h3>Watch list (Last 30 matches)</h3>
            <div className={enoughMatches ? "seed-results-container" : ""}>
              {
                enoughMatches ?
                matchedMovies.reverse()?.slice(0, 30).map((match: MatchType) => {
                  return MatchCard(match, props.userModel.username);
                }) ?? ""
                : <p>You haven't matched with anyone yet how sad!</p>
              }
            </div>
          </div>
          <div className="section">
            <h3>Liked Movies (Last 50 liked)</h3>
            {props.likedMoviesTitles.length === 0 ? (
              <p>You haven't liked any movies yet. Go explore!</p>
            ) : (
              <div className="seed-results-container">
                {likedMovies?.reverse().slice(0, 49).map(likedMoviesOutput) ?? ""}
              </div>
            )}
          </div>
          {/*
          <div className="section">
            <BarChart labels={likedGenres} values={genreLikeCounts}/>
          </div>*/
          }

        </div>
      </div>
    </>
    ) : (<div className="center-div">
      <button className="secondary-button" onClick={() => { window.location.hash = "#/account" }}>
        Log In
      </button>
    </div>)
  );
}