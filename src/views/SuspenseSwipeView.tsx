import { observer } from "mobx-react-lite";
import "../style.css"
import type { MovieDetails } from "../apiConfig";
import { motion, useMotionValue, useMotionValueEvent, useTransform } from "framer-motion"
import type { PromiseState } from "../resolvePromise";
import { useRef } from "react";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

export type SwipeViewProps = {
  prefetchWindowPrmsState: PromiseState;
  currentSessionId: string | null;
  onDislike: () => void;
  onLike: () => void;
  onMoreInfo: () => void;
}

const SuspenseSwipeView = observer(
  function SwipeViewRender(props: SwipeViewProps) {

    const TMDB_BASE_URL = "https://image.tmdb.org/t/p/";
    const POSTER_WIDTH_URL = "w780/";

    function getDetailsQueue(details: MovieDetails[]) {
      if (!details) { return };
      const detailsQueue = [...details].reverse();
      return detailsQueue
    }

    const detailsQueue = getDetailsQueue(props.prefetchWindowPrmsState.data);
    const firstDetail = !!detailsQueue ? detailsQueue[detailsQueue.length-1] : undefined;
    const swipeLockedRef = useRef(false);   // prevents spam
    function handleSwipe(dir: "left" | "right") {
      if (swipeLockedRef.current) return;  // BLOCK duplicates
      swipeLockedRef.current = true;

      const likeIcon = document.getElementById("like-icon");
      const dislikeIcon = document.getElementById("dislike-icon");
      if (dir === "right" && !!likeIcon) { likeIcon.style.fontSize = "90px" };
      if (dir === "left" && !!dislikeIcon) { dislikeIcon.style.fontSize = "90px" };

      setTimeout(() => {
        if (dir === "right") {
          props.onLike();     // calls nextMovieEvt indirectly
        } else {
          props.onDislike();
        }
        
      }, 15); // match your animation duration
    }

    function outputCardsCB(detail: MovieDetails, index: number, array: MovieDetails[]) {
      if (!detail) { return };
      return <Card key={detail.id} id={detail.id} url={TMDB_BASE_URL + POSTER_WIDTH_URL + detail.poster_path} rightSwipeCB={() => handleSwipe("right")} leftSwipeCB={() => handleSwipe("left")}/>
    }
    function outputTitle(firstDetail: MovieDetails | undefined) {
      if (!firstDetail?.title) { return "" };
      const title = firstDetail?.title ?? "";
      return title.length < 35 ? title.slice(0, 35) : title.slice(0, 35) + "..."; 
    }

    return (
      <div className="swipe-container">
        <p>Current Session id: {props.currentSessionId}</p>
        {detailsQueue?.map(outputCardsCB)}
        <h3>{outputTitle(firstDetail)}</h3>
        <div className="controls">
          <IconButton className="dislike-btn" onClick={() => handleSwipe("left")}>
            <CloseRoundedIcon id="dislike-icon"/>
          </IconButton>
          <IconButton className="like-btn" onClick={() => handleSwipe("right")}>
            <FavoriteIcon id="like-icon"/>
          </IconButton>
          <IconButton className="more-info-btn" onClick={props.onMoreInfo}>
            <MoreHorizIcon />
          </IconButton>
        </div>
      </div>
    );
  }
);


const Card = ({id, url, rightSwipeCB, leftSwipeCB} : {id: number, url: string, rightSwipeCB: CallableFunction, leftSwipeCB: CallableFunction}) => {
  const x = useMotionValue(0);

  const opacity = useTransform(x, [-150, 0, 150], [0, 1, 0]);
  const rotate = useTransform(x, [-150, 150], [-10, 10]);

  const handleDragEndCB = () => {

  }
  useMotionValueEvent(x, "change", handleDragEndCB);

  return <motion.img
    src={url}
    alt={"Placeholder"}
    className="card"
    drag="x"
    dragConstraints={{
      left: 0,
      right: 0,
    }}
    style={{
      gridRow: 1,
      gridColumn: 1,
      x,
      opacity,
      rotate,
    }}
  />
}

export { SuspenseSwipeView };

