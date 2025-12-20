import { observer } from "mobx-react-lite";
import { ProfileView } from "../views/profileView.tsx";
import type { MovieModel } from "../MovieModel.ts";
import type { UserModel } from "../UserModel";
import type { TMDBMoviePageResult } from "../apiConfig.ts";
import { signOutUser } from "../authService";
import type { SessionModel } from "../SessionModel.ts";
import { useState } from "react";
import { DetailsView } from "../views/DetailsView.tsx";

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

    function handleUsernameChangeACB(newName: string) {
      props.userModel.setUsername(newName);
    }

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

    const likedMovieTitles = props.userModel.likes.map(extactLikedMovieTitlesCB);
    const profile = !!props.model.genresPrmsState.data 
      ?
      <ProfileView
        userModel={props.userModel}
        sessionModel={props.sessionModel}
        likedMovies={props.userModel.likes}
        likedMoviesTitles={likedMovieTitles}
        onUsernameChange={handleUsernameChangeACB}
        onRemoveLike={handleRemoveLikeACB}
        onMovieClick={handleMovieClickACB}
        onSignOutClick={handleSignOutACB}
        matchedMovies={props.userModel.matches}
        model={props.model}
      />
      : "";


		const HAS_ALL_DETAILS_DATA = (
			!!props.model.movieDetailsPrmsState.data
			// && !!props.model.movieVideosPrmsState.data
			&& !!props.model.movieCreditsPrmsState.data
			&& !!props.model.imdbRatingPrmsState.data
			&& !!props.model.watchProvidersPrmsState.data
		)
		const details = showDetails && HAS_ALL_DETAILS_DATA 
            ? <DetailsView details={props.model.movieDetailsPrmsState.data} video={props.model.movieVideosPrmsState.data} 
            credits={props.model.movieCreditsPrmsState.data} imdb={props.model.imdbRatingPrmsState.data} 
            watchProviders={props.model.watchProvidersPrmsState.data} onClose={closeDetailsACB}/> 
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