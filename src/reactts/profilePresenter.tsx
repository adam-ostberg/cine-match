import { observer } from "mobx-react-lite";
import { ProfileView } from "../views/profileView.tsx";
import type { ModelType } from "../MovieModel.ts";
import type { UserModelType } from "../UserModel";
import type { TMDBMoviePageResult } from "../apiConfig.ts";
import { signOutUser } from "../authService";

export type ProfilePresenterProps = {
  model: ModelType;
  userModel: UserModelType;
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

    function handleSignOutACB() {
      signOutUser().then(() => {
        window.location.hash = "#/";
      });
    }

    return (
      <ProfileView
        username={props.userModel.username}
        userId={props.userModel.userId || ""}
        likedMovies={props.model.alltimeLikedMoviesArray}
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