import "../style.css"
import { type TMDBMoviePageResult } from "../apiConfig.ts";
/* npm install react-icons */
import { FaUserCircle } from "react-icons/fa";
import { IconButton } from "@mui/material";
import { UserAvatar } from "../components/UserAvatar.tsx";
import { Navbar } from "../reactts/navbarPresenter.tsx";
import type { UserModelType } from "../UserModel.ts";
import type { SessionType } from "../SessionModel.ts";

export type ProfileViewProps = {
  userModel: UserModelType;
  sessionModel: SessionType;
  likedMovies: TMDBMoviePageResult[];
  likedMoviesTitles: string[];
  matchedMovies: TMDBMoviePageResult[];

  onUsernameChange: (name: string) => void;
  onRemoveLike: (movie: TMDBMoviePageResult) => void
  onMovieClick: (id: number) => void;
  onSignOutClick: () => void;
}

export function ProfileView(props: ProfileViewProps) {

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
            <h3>Liked Movies (All Time)</h3>
            {props.likedMoviesTitles.length === 0 ? (
              <p>You haven't liked any movies yet. Go explore!</p>
            ) : (
              <div className="seed-results-container">
                {LikedMoviesList(props.likedMoviesTitles)}
              </div>
            )}
          </div>
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

function LikedMoviesList(likedMoviesTitles: string[]) {
  return (
    <ul>
      {likedMoviesTitles.map((title, index) => (
        <li key={index}>{title}</li>
      ))}
    </ul>
  );
}