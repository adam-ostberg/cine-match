
import { observer } from "mobx-react-lite";
import { DetailsView } from "../views/DetailsView.tsx";
import {  MovieModel } from "../MovieModel.ts";
import { useNavigate } from "react-router-dom";

export type DetailsPresenterProps = {
  model: MovieModel;
}

const Details = observer(  // needed for the presenter to update (its view) when relevant parts of the model change
  function DetailsRender(props: DetailsPresenterProps) {

    const navigate = useNavigate();
    const moviedetailsPrmsState = props.model.movieDetailsPrmsState
    const movieVideosPrmsState = props.model.movieVideosPrmsState;
    const movieCreditsPrmsState = props.model.movieCreditsPrmsState;
    const imdbRatingPrmsState = props.model.imdbRatingPrmsState;
    const watchProvidersPrmsState = props.model.watchProvidersPrmsState;

    function closeACB() {
      navigate(-1);
      // const b = 5
      //props.model.closeDetails();
    }

    const HAS_ENOUGH_DATA = !!moviedetailsPrmsState.data && !!movieCreditsPrmsState.data && !!imdbRatingPrmsState.data && watchProvidersPrmsState.data;

    const view =
      HAS_ENOUGH_DATA
        ? <DetailsView details={moviedetailsPrmsState.data} video={movieVideosPrmsState.data} credits={movieCreditsPrmsState.data} imdb={imdbRatingPrmsState.data} watchProviders={watchProvidersPrmsState.data} onClose={closeACB} />
        : ("__no_data__");

    return (
      view
    );
  }
);

export { Details }
