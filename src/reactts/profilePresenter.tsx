import { observer } from "mobx-react-lite";
import { ProfileView } from "../views/profileView.tsx";
import type { MovieModel } from "../MovieModel.ts";
import type { UserModel } from "../UserModel";
import type { TMDBMoviePageResult } from "../apiConfig.ts";
import { signOutUser } from "../authService";
import type { SessionModel } from "../SessionModel.ts";
import { sendFriendRequest, acceptFriendRequest } from "../firestoreModel.ts";

export type ProfilePresenterProps = {
  model: MovieModel;
  userModel: UserModel;
  sessionModel: SessionModel;
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

    async function handleSendFriendRequestACB(friendUsername: string) {
      try {
        await sendFriendRequest(props.userModel, friendUsername);
      } catch (e: any) {
        // TODO add beter UX for this!
        alert("Failed to send friend request: " + e.message);
      }
    }

    async function handleAcceptFriendRequestACB(fromUsername: string, fromUserId: string) {
      try {
        await acceptFriendRequest(props.userModel, fromUserId, fromUsername);
      } catch (e: any) {
        // TODO add beter UX for this!
        alert("Failed to accept friend request: " + e.message);
      }
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
        matchedMovies={props.userModel.matches}
        friendRequests={props.userModel.friendRequests}
        friends={props.userModel.friends}
        onSendFriendRequest={handleSendFriendRequestACB}
        onAcceptFriendRequest={handleAcceptFriendRequestACB}
      />
    );
  }
);

export { Profile }