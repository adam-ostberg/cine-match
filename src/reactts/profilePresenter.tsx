import { observer } from "mobx-react-lite";
import { ProfileView } from "../views/profileView.tsx";
import type { ModelType } from "../MovieModel.ts";
import type { UserModelType } from "../UserModel";
import type { TMDBMoviePageResult } from "../apiConfig.ts";
import { signOutUser } from "../authService";
import type { SessionType } from "../SessionModel.ts";

export type ProfilePresenterProps = {
  model: ModelType;
  userModel: UserModelType;
  sessionModel: SessionType;
}

type LikedMovie = {
  title: string;
  movieId: string;
  poster_path: string | null;
}

const Profile = observer(
  function ProfileRender(props: ProfilePresenterProps) {

    function handleUsernameChangeACB(newName: string) {
      props.userModel.setUsername(newName);
    }

    function handleRemoveLikeACB(movie: TMDBMoviePageResult) {
      props.model.toggleAlltimeLike(movie, true);
    }

    // Handle clicking a movie to view details
    function handleMovieClickACB(_movieId: number) {
      //  props.model.setCurrentMovie(movieId);
    }

    function extactLikedMovieTitlesCB(movie: LikedMovie) {
      return movie.title;
    }

    function handleSignOutACB() {
      signOutUser().then(() => {
        window.location.hash = "#/";
      });
    }

    const likedMovieTitles = props.userModel.likes.map(extactLikedMovieTitlesCB);

    return (
      <ProfileView
        userModel={props.userModel}
        sessionModel={props.sessionModel}
        likedMovies={props.model.alltimeLikedMoviesArray}
        likedMoviesTitles={likedMovieTitles}
        onUsernameChange={handleUsernameChangeACB}
        onRemoveLike={handleRemoveLikeACB}
        onMovieClick={handleMovieClickACB}
        onSignOutClick={handleSignOutACB}
        matchedMovies={[]}
      />
    );
  }
);

export { Profile }