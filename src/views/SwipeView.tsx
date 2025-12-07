import { observer } from "mobx-react-lite";
import "../style.css"
import type { MovieDetails } from "../apiConfig";
import { animate, motion, useMotionValue, useMotionValueEvent, useTransform } from "framer-motion"
import type { PromiseState } from "../resolvePromise";
import { useEffect, useRef } from "react";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useState } from "react";

export type SwipeViewProps = {
  prefetchWindowPrmsState: PromiseState;
  currentSessionId: string | null;
  onDislike: () => void;
  onLike: () => void;
  onMoreInfo: () => void;
}

type SwipeDir = "left" | "right" | null;

const SwipeView = observer(
  function SwipeViewRender(props: SwipeViewProps) {

  useEffect(() => {
    const hasReloaded = sessionStorage.getItem("my-page-reloaded");

    if (!hasReloaded) {
      sessionStorage.setItem("my-page-reloaded", "true");
      window.location.reload();
    }
  }, []);

    const TMDB_BASE_URL = "https://image.tmdb.org/t/p/";
    const POSTER_WIDTH_URL = "w780/";


    function getDetailsQueue(details: MovieDetails[]) {
      if (!details) { return };
      const detailsQueue = [...details].reverse();
      return detailsQueue
    }

    const [swipeDirection, setSwipeDirection] = useState<SwipeDir>(null);
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
        
      }, 0); // match your animation duration
    }

    function outputCardsCB(detail: MovieDetails, index: number, array: MovieDetails[], swipeDirection: SwipeDir) {
      if (!detail) { return };
      return <SwipeCard key={detail.id} id={detail.id} detailsQueue={array} url={TMDB_BASE_URL + POSTER_WIDTH_URL + detail.poster_path} rightSwipeCB={() => handleSwipe("right")} leftSwipeCB={() => handleSwipe("left")} swipeDirection={swipeDirection}/>
    }
    function outputTitle(firstDetail: MovieDetails | undefined) {
      if (!firstDetail?.title) { return "" };
      const title = firstDetail?.title ?? "";
      return title.length < 35 ? title.slice(0, 35) : title.slice(0, 35) + "..."; 
    }

    return (
      <div className="swipe-container">
        <p>Current Session id: {props.currentSessionId}</p>
        {detailsQueue?.map((detail, index, array) => outputCardsCB(detail, index, array, swipeDirection))}
        <h3>{outputTitle(firstDetail)}</h3>
        <div className="controls">
          <IconButton className="dislike-btn" onClick={() => setSwipeDirection("left")}>
            <CloseRoundedIcon id="dislike-icon"/>
          </IconButton>
          <IconButton className="like-btn" onClick={() => setSwipeDirection("right")}>
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


const SwipeCard = ({id, detailsQueue, url, rightSwipeCB, leftSwipeCB, swipeDirection} : {id: number, detailsQueue: MovieDetails[], url: string, rightSwipeCB: CallableFunction, leftSwipeCB: CallableFunction, swipeDirection: SwipeDir}) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0)

  const opacity = useTransform(x, [-150, 0, 150], [0, 1, 0]);
  const rotate = useTransform(x, [150, -150], [-18, 18]);

  useEffect(() => {
    if (!swipeDirection) return;
    const targetX = swipeDirection === "right" ? 300 : -300;

    const controls = animate(x, targetX, {
      type: "spring",
      stiffness: 300,
      damping: 30,
      onComplete: () => {
        if (swipeDirection === "right") rightSwipeCB();
        else leftSwipeCB();
      },    
    });
    // cleanup if component unmounts mid-animation
    return () => controls.stop();
  }, [swipeDirection, x, id, rightSwipeCB, leftSwipeCB]);


  const handleDragEndCB = () => {
    if (x.get() > 80) {
      rightSwipeCB();
      console.log()
    }
    else if (x.get() < -80) {
      leftSwipeCB();
    }
  }
  useMotionValueEvent(x, "change", handleDragEndCB);

  return <motion.img
    src={url}
    alt={"Placeholder"}
    className="swipe-card"
    drag
    dragConstraints={{
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    }}
    style={{
      gridRow: 1,
      gridColumn: 1,
      x,
      y,
      opacity,
      rotate,
    }}
  />
}

export { SwipeView, SwipeCard };

