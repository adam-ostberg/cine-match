import "../style.css"
import { getGenres, type TMDBMoviePageResult } from "../apiConfig.ts";
/* npm install react-icons */
import { FaUserCircle } from "react-icons/fa";
import { IconButton } from "@mui/material";
import { UserAvatar } from "../components/UserAvatar.tsx";
import { Navbar } from "../reactts/navbarPresenter.tsx";
import type { UserModel, MatchType } from "../UserModel.ts";
import type { SessionModel } from "../SessionModel.ts";
import type { MovieModel } from "../MovieModel.ts";
import { CustomTooltip } from "../tooltip.tsx";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);
import { Bar } from 'react-chartjs-2';
import type { LikedMovie } from "../reactts/profilePresenter.tsx";


export type ProfileViewProps = {
  model: MovieModel;
  userModel: UserModel;
  sessionModel: SessionModel;
  likedMovies: LikedMovie[];
  likedMoviesTitles: string[];
  matchedMovies: MatchType[];

  onUsernameChange: (name: string) => void;
  onRemoveLike: (movie: TMDBMoviePageResult) => void
  onMovieClick: (id: number) => void;
  onSignOutClick: () => void;
}

export function ProfileView(props: ProfileViewProps) {

  const TMDB_BASE_URL = "https://image.tmdb.org/t/p/";
  const POSTER_WIDTH_URL = "w780/";

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
  const enoughMatches = (props.matchedMovies.length ?? 0) > 0;
  /*
  function getTopLikedGenres(movies: TMDBMoviePageResult[]): [string[], number[]] {
    if (!movies || (movies.length ?? 0) === 0) return [[], []];
    const genreList = props.model.genres ?? [];
    const genreToCount = new Map<string, number>();
    const idToGenreName = new Map<number, string>(genreList.map(g => [g.id, g.name]));

    for (const movie of movies) {
      const ids = movie.genre_ids.forEach(id => {
        const genreName = idToGenreName.get(id);
        if (!!genreName || genreName !== undefined) {
          genreToCount.set(genreName, (genreToCount.get(genreName) ?? 0) + 1)
        }
      })
    }
    const entries = Array.from(genreToCount.entries())
      .sort((a, b) => b[1] - a[1])   // sort by value desc
      .slice(0, 5);                 // take top 5

    const genres = entries.map(([label]) => label);
    const likeCounts = entries.map(([, value]) => value);
      
    return [genres, likeCounts];
  }
  const [likedGenres, genreLikeCounts] = getTopLikedGenres(props.likedMovies);
  */

  // TODO: Maybe remove this as its not linked to the new system
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
    let participants = enoughUsers 
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
                <h3>Watch list (Last 30 matches)</h3>
                
                <div className={enoughMatches ? "seed-results-container" : ""}>
                  {
                    enoughMatches ?
                    props.matchedMovies?.slice(0, 30)?.reverse().map((match: MatchType) => {
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
                {props.likedMovies?.slice(0, 49).reverse().map(likedMoviesOutput) ?? ""}
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




type BarChartProps = {
  labels: string[];
  values: number[];
};

export function BarChart({ labels, values }: BarChartProps) {
  if (!labels || !values) return;
  const data = {
    labels,
    datasets: [
      {
        label: 'Sales',
        data: values,
        backgroundColor: '#4f46e5',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
    },
  };

  return <Bar data={data} options={options} />;
}