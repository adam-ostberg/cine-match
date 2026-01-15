import { observer } from "mobx-react-lite";
import { ProfileView } from "../views/profileView.tsx";
import type { MovieModel } from "../MovieModel.ts";
import type { UserModel } from "../UserModel";
import type { TMDBMoviePageResult } from "../apiConfig.ts";
import { signOutUser } from "../authService";
import type { SessionModel } from "../SessionModel.ts";
import { useState } from "react";
import { DetailsView } from "../views/DetailsView.tsx";
import { sendFriendRequest } from "../firestoreModel.ts";

export type ProfilePresenterProps = {
  model: MovieModel;
  userModel: UserModel;
  sessionModel: SessionModel;
}

export type LikedMovie = {
  title: string;
  movieId: string;
  poster_path: string | null;
}

const Profile = observer(
  function ProfileRender(props: ProfilePresenterProps) {
    const [showDetails, setShowDetails] = useState(false); // State to control details overlay
    const [friendRequestMessage, setFriendRequestMessage] = useState<{ text: string; isError: boolean } | null>(null);

    function handleRemoveLikeACB(movie: TMDBMoviePageResult) {
      props.model.toggleAlltimeLike(movie, true);
    }

    // Handle clicking a movie to view details
    function handleMovieClickACB(movieId: number) {
      props.model.setCurrentMovieId(movieId);
      setShowDetails(true);
    }

    function extactLikedMovieTitlesCB(movie: LikedMovie) {
      return movie.title;
    }

    function handleSignOutACB() {
      signOutUser().then(() => {
        window.location.hash = "#/";
      });
    }
    function closeDetailsACB() {
      if (!showDetails) return;
			const background = document.querySelector(".details-view-background"); 
			background?.classList.remove("is-dark");
      setShowDetails(false); // Hide details overlay
    }

    async function handleSendFriendRequestACB(friendUsername: string) {
      if (!friendUsername.trim()) {
        props.userModel.setFriendRequestSuccessful("failure")
        setFriendRequestMessage({ text: "Please enter a username", isError: true });
        setTimeout(() => setFriendRequestMessage(null), 3000);
        return;
      }
      props.userModel.setFriendRequestSuccessful("pending")
      props.userModel.sendFriendRequest(friendUsername);
    }

    function handleAcceptFriendRequestACB(fromUsername: string, fromUserId: string) {
      props.userModel.acceptFriendRequestAction(fromUserId, fromUsername);
    }

    function handleSendInviteACB(toUserId: string) {
      // First create a session, then send the invite
      // We need to wait for session to be created before sending invite
      props.userModel.createSessionAction();
      
      // Use a small delay to wait for session creation, then send invite
      // This is a workaround - ideally we'd chain these in the persistence layer
      const checkAndSendInvite = () => {
        if (props.userModel.currentSessionId) {
          props.userModel.sendLobbyInviteAction(toUserId);
        } else {
          setTimeout(checkAndSendInvite, 100);
        }
      };
      setTimeout(checkAndSendInvite, 100);
    }

    const likedMovieTitles = props.userModel.likes.map(extactLikedMovieTitlesCB);
    const profile = !!props.model.genresPrmsState.data 
      ?
      <ProfileView
        userModel={props.userModel}
        sessionModel={props.sessionModel}
        likedMovies={props.userModel.likes}
        likedMoviesTitles={likedMovieTitles}
        onRemoveLike={handleRemoveLikeACB}
        onMovieClick={handleMovieClickACB}
        onSignOutClick={handleSignOutACB}
        matchedMovies={props.userModel.matches}
        model={props.model}
        friendRequests={props.userModel.friendRequests}
        friends={props.userModel.friends}
        onSendFriendRequest={handleSendFriendRequestACB}
        onAcceptFriendRequest={handleAcceptFriendRequestACB}
        onSendInvite={handleSendInviteACB}
        sucessfulFriendRequest={props.userModel.successfulFriendRequest}
      />
      : "";

		const HAS_ALL_DETAILS_DATA = (
			!!props.model.movieDetailsPrmsState.data
			&& !!props.model.movieCreditsPrmsState.data
			&& !!props.model.imdbRatingPrmsState.data
			&& !!props.model.watchProvidersPrmsState.data
		)
		const details = showDetails && HAS_ALL_DETAILS_DATA 
            ? <DetailsView 
              details={props.model.movieDetailsPrmsState.data} 
              video={props.model.movieVideosPrmsState.data} 
              credits={props.model.movieCreditsPrmsState.data} 
              imdb={props.model.imdbRatingPrmsState.data} 
              watchProviders={props.model.watchProvidersPrmsState.data} 
              onClose={closeDetailsACB}
            /> 
            : "";
    return (
      <div className="details-view-background" onClick={closeDetailsACB}>
        {profile}
        {details}
      </div>
    );
  }
);

export { Profile }