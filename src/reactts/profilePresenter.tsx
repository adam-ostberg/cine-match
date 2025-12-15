import { observer } from "mobx-react-lite";
import { ProfileView } from "../views/profileView.tsx";
import type { ModelType } from "../MovieModel.ts";
import type { TMDBMoviePageResult } from "../apiConfig.ts";

export type ProfilePresenterProps = {
  model: ModelType;
}

const Profile = observer(
  function ProfileRender(props: ProfilePresenterProps) {

    function handleUsernameChangeACB(_newName: string) {
      // props.model.setUsername(newName);
    }

    function handleRemoveLikeACB(movie: TMDBMoviePageResult) {
      props.model.toggleAlltimeLike(movie, true);
    }

    // Handle clicking a movie to view details
    function handleMovieClickACB(_movieId: number) {
      //  props.model.setCurrentMovie(movieId);
    }

    return (
      <ProfileView
        username={props.model.username}
        profilePic={props.model.profilePic}
        likedMovies={props.model.alltimeLikedMoviesArray}
        onUsernameChange={handleUsernameChangeACB}
        onRemoveLike={handleRemoveLikeACB}
        onMovieClick={handleMovieClickACB}
        matchedMovies={[]}
      />
    );
  }
);

export { Profile }