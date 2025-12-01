
import { observer } from "mobx-react-lite";
import { DetailsView, type MovieDetails } from "../views/DetailsView.tsx";

type DetailsModel = {
  currentMovie: MovieDetails/*  | null */; // [TODO] Add suspenseview
  closeDetails: () => void;
}

export type DetailsPresenterProps = {
  model: DetailsModel;
}

const Details = observer(  // needed for the presenter to update (its view) when relevant parts of the model change
  function DetailsRender(props: DetailsPresenterProps) {

    /* if (!props.model.currentMovie) {
      return <SuspenseView />;
    } */

    function closeACB() {
      props.model.closeDetails();
    }

    return (
      <DetailsView
        movie={props.model.currentMovie}
        onClose={closeACB}
      />
    );
  }
);

export { Details }
