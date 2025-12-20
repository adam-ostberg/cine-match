import "../style.css"
import { getGenres, type TMDBMoviePageResult } from "../apiConfig.ts";
/* npm install react-icons */
import { FaUserCircle } from "react-icons/fa";
import { IconButton } from "@mui/material";
import { UserAvatar } from "../components/UserAvatar.tsx";
import { Navbar } from "../reactts/navbarPresenter.tsx";
import type { UserModel, MatchType } from "../UserModel.ts";
import type { SessionModel } from "../SessionModel.ts";
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

export type ProfileViewProps = {
  userModel: UserModel;
  sessionModel: SessionModel;
  likedMovies: TMDBMoviePageResult[];
  likedMoviesTitles: string[];
  matchedMovies: MatchType[];

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

  /*
  function getTopLikedGenres(movies: TMDBMoviePageResult[]): Array<string[] | number[]> {
    const genreData = await getGenres();
    const genreList = genreData?.genres;
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
  }*/

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
                <h3>Watch list (Your matches)</h3>
                <div className="matches-cards">
                  {
                    props.matchedMovies.map((match: MatchType) => {
                      return MatchCard(match);
                    })
                  }
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
          <div className="section">
            <BarChart labels={['Jan', 'Feb', 'Mar', 'Apr']} values={[120, 190, 300, 250]}/>
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

function MatchCard(match: MatchType) {
  return (
    <div className="match-card" key={match.movieId}>
      <h4 className="match-card-title">{match.title}</h4>
      <img src={match.poster_path ?? ""} alt={"Poster of " + match.title} />
      <p className="match-card-match-with">Watch with: </p>
      {
      match.usersInSession.map((username: string) => {
        return <p>{username}</p>
      })
      }
    </div>
  );
}


type BarChartProps = {
  labels: string[];
  values: number[];
};

export function BarChart({ labels, values }: BarChartProps) {
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