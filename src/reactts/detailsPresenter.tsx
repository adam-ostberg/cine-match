
import { observer } from "mobx-react-lite";
import { DetailsView } from "../views/DetailsView.tsx";
import type { ModelType } from "../MovieModel.ts";

export type DetailsPresenterProps = {
  model: ModelType;
}

const Details = observer(  // needed for the presenter to update (its view) when relevant parts of the model change
  function DetailsRender(props: DetailsPresenterProps) {

    const moviedetailsPrmsState = props.model.movieDetailsPrmsState
    const movieVideosPrmsState = props.model.movieVideosPrmsState;
    const movieCreditsPrmsState = props.model.movieCreditsPrmsState;
    const imdbRatingPrmsState = props.model.imdbRatingPrmsState;

    function getTrailerACB() {
      props.model.getMovieTrailer();
    }
    /* if (!props.model.currentMovie) {
      return <SuspenseView />;
    } */
    function closeACB() {
      const b = 5
      //props.model.closeDetails();
    }

    const HAS_ENOUGH_DATA = !!moviedetailsPrmsState.data && !!movieCreditsPrmsState.data && !!imdbRatingPrmsState.data;

    const view = HAS_ENOUGH_DATA ? <DetailsView details={moviedetailsPrmsState.data} video={movieVideosPrmsState.data} credits={movieCreditsPrmsState.data} imdb={imdbRatingPrmsState.data} onClose={closeACB} trailerKey={getTrailerACB} /> : ("__no_data__");

    return (
      view
    );
  }
);

export { Details }
