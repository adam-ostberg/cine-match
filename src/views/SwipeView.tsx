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
import { type PanInfo } from "framer-motion";
import { FaUserCircle } from "react-icons/fa";
import ViewSidebarIcon from '@mui/icons-material/ViewSidebar';
import TuneIcon from '@mui/icons-material/Tune';
import { hideRootAndMainContentOverflow } from "../helperFunctions";
import { MatchAnimationView } from "./matchAnimationView";
import type { SessionType, UserInfoType } from "../SessionModel";
import type { UserModelType } from "../UserModel";
import { LoadingSpinner } from "../components/LoadingSpinner.tsx";
import { UserAvatar } from "../components/UserAvatar.tsx";

export type SwipeViewProps = {
  prefetchWindowPrmsState: PromiseState;
  currentSessionId: string | null;
  sessionModel: SessionType;
  sessionShowMatchAnimation: boolean;
  userModel: UserModelType;
  onDislike: (id: number) => void;
  onLike: (id: number) => void;
  onMoreInfo: () => void;
}

type SwipeDir = "left" | "right" | null;


function SwipeView(props: SwipeViewProps) {

  const TMDB_BASE_URL = "https://image.tmdb.org/t/p/";
  const POSTER_WIDTH_URL = "w780/";

  function getDetailsQueue(details: MovieDetails[] | null) {
    if (!details) { return };
    const detailsQueue = [...details].reverse();
    return detailsQueue
  }

  const [showMatchAnimation, setShowMatchAnimation] = useState(false);
  const [cachedDetails, setCachedDetails] = useState<MovieDetails[] | null>(null);
  const [swipeCardIsCached, setSwipeCardIsCached] = useState<boolean>(false);

  // Whenever new data arrives, store it
  useEffect(() => {
    const data = props.prefetchWindowPrmsState.data as MovieDetails[] | null;
    if (data && Array.isArray(data) && data.length > 0) {
      setSwipeCardIsCached(false);
      setCachedDetails(data);
    }
    else {
      setSwipeCardIsCached(true);
    }
  }, [props.prefetchWindowPrmsState.data]);

  useEffect(() => {
    setShowMatchAnimation(props.sessionShowMatchAnimation)
  }, [props.sessionShowMatchAnimation]);

  // Prefer the latest non-null data, but fall back to cached
  const effectiveDetails = (props.prefetchWindowPrmsState.data as MovieDetails[] | null) || cachedDetails;
  const detailsQueue = getDetailsQueue(effectiveDetails);

  const firstDetail = !!detailsQueue ? detailsQueue[detailsQueue.length - 1] : undefined;
  const [swipeDirection, setSwipeDirection] = useState<SwipeDir>(null);
  function handleSwipe(dir: "left" | "right", id: number) {

    if (dir === "right") {
      props.onLike(id);     
    } else {
      props.onDislike(id);
    }
    setSwipeDirection(null);
  }

  function outputCardsCB(detail: MovieDetails, index: number, array: MovieDetails[], swipeDirection: SwipeDir) {
    if (!detail) { return };
    const is_top_card = index === array.length-1;
    return <SwipeCard key={detail.id} id={detail.id} url={TMDB_BASE_URL + POSTER_WIDTH_URL + detail.poster_path} rightSwipeCB={() => handleSwipe("right", detail.id)} leftSwipeCB={() => handleSwipe("left", detail.id)} upSwipeCB={props.onMoreInfo} swipeDirection={swipeDirection} is_top_card={is_top_card} isCached={swipeCardIsCached}/>
  }
  function outputTitle(firstDetail: MovieDetails | undefined) {
    if (!firstDetail?.title) { return "" };
    const title = firstDetail?.title ?? "";
    return title.length < 35 ? title.slice(0, 35) : title.slice(0, 35) + "..."; 
  }
  function outputParticipants(participant: UserInfoType) {
    return (
      <div key={participant.userId || Math.random()} className="sidebar-user-item">
        {participant.userId ? (
          <>
            <UserAvatar
              userId={participant.userId}
              className="profile-pic" 
              size={50}
            />
            <p>{participant.username}</p>
          </>
        ) : (
          <>
            <FaUserCircle size={50} className="profile-pic placeholder" />
            <p>loading...</p>
          </>
        )}
      </div>
    );
  }
  const [isSidebarOpen, setSidebarIsOpen] = useState(true);

  const swipeSidebarClassNames = isSidebarOpen ? "swipe-sidebar is-open" : "swipe-sidebar";

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)');

    const sync = (matches: boolean) => {
      if (matches) {
        const sidebar = document.getElementById("swipeSidebar")
        if (!!sidebar) { sidebar.style.transition = "none"};
        setTimeout(() => {
          if (!!sidebar) { sidebar.style.transition = "transform ease 0.2s" };
        }, 300);
      }
      setSidebarIsOpen(!matches); // mobile => false, desktop => true
    };
    const onChange = (e: MediaQueryListEvent) => {
      sync(e.matches);
    };

    // initial sync
    sync(mq.matches);

    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return (
    <div className="swipe-container">
      <div className="swipe-content">
        {detailsQueue?.map((detail, index, array) => outputCardsCB(detail, index, array, swipeDirection)) ?? <LoadingSpinner size={100} />}
        <div className="swipe-title">{outputTitle(firstDetail)}</div>
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
      <aside className={swipeSidebarClassNames} id="swipeSidebar">
        <IconButton className="sidebar-toggle" aria-label="Toggle sidebar" onClick={() => setSidebarIsOpen(o => !o)}>
          <TuneIcon />
        </IconButton>
        <div className="sidebar-content">
          <h2>Status</h2>
          <p id="current-session">Current Session id: {props.sessionModel.sessionId}</p>
          <h2>Lobby</h2>
          <div className="sidebar-lobby-container">
            {props.sessionModel.participants.map(outputParticipants)}
          </div>
        </div>
      </aside>
      {showMatchAnimation && <MatchAnimationView />}
    </div>
  );
}

// @ts-ignore [TODO] remove
const SwipeCard = ({id, url, rightSwipeCB, leftSwipeCB, upSwipeCB, swipeDirection, is_top_card, isCached} : {id: number, url: string, rightSwipeCB: CallableFunction, leftSwipeCB: CallableFunction, upSwipeCB: CallableFunction, swipeDirection: SwipeDir, is_top_card: boolean, isCached: boolean}) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0)
  const opacity = useTransform(x, [-150, 0, 150], [0, 1, 0]);
  const dislikeOpacity = useTransform(x, [-145 ,-70, 0, 70] , [0, 1, 0, 0]);
  const likeOpacity = useTransform(x, [-70, 0, 70, 145] , [0, 0, 0.9, 0]);
  isCached
  const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);

  const mapRange = (
      value: number,
      inMin: number,
      inMax: number,
      outMin: number,
      outMax: number
    ) => {
      const t = clamp01((value - inMin) / (inMax - inMin));
      return outMin + t * (outMax - outMin);
    };

  const settingsOpacity = useTransform(
    [x, y],
    (values: number[]) => {
      const latestX = values[0] ?? 0;
      const latestY = values[1] ?? 0;

      const yOpacity = mapRange(latestY, -80, 0, 0.7, 0);
      let xOpacity = mapRange(Math.abs(latestX), 0, 50, 0.7, 0);
      if (Math.abs(latestX) > 10) {
        xOpacity = mapRange(Math.abs(latestX), 0, 30, 0.4, 0);
      }

      // choose behavior
      return Math.min(yOpacity, xOpacity);
    }
  );
  const rotate = useTransform(x, [150, -150], [-18, 18]);

  useEffect(() => {
    if (!swipeDirection || !is_top_card) return;
    const targetX = swipeDirection === "right" ? 200 : -200;

    const controls = animate(x, targetX, {
      type: "tween",
      duration: 0.19,
      ease: "easeOut",
      onComplete: () => {
        if (swipeDirection === "right") rightSwipeCB();
        else leftSwipeCB();
      },
    });
    // cleanup if component unmounts mid-animation
    return () => controls.stop();
  }, [swipeDirection, x, id, rightSwipeCB, leftSwipeCB]);

    // inside SwipeCard
  const handleDragEnd = (_event: any, info: PanInfo) => {
    if (swipeDirection) return;
    if (!is_top_card) return;

    if (info.offset.x > 80) {
      const controls = animate(x, 150, {
        type: "tween",
        duration: 0.1,
        ease: "easeOut",
        onComplete: () => rightSwipeCB(),
      });
    } else if (info.offset.x < -80) {
      const controls = animate(x, -150, {
        type: "tween",
        duration: 0.1,
        ease: "easeOut",
        onComplete: () => leftSwipeCB(),
      });
    } else if (info.offset.y < -80 && Math.abs(info.offset.x) < 80) {
      // you might want a vertical animation here too
      upSwipeCB();
      animate(y, 0, { type: "tween", duration: 0.15, ease: "easeOut" });
      animate(x, 0, { type: "tween", duration: 0.15, ease: "easeOut" });
    } else {
      animate(x, 0, { type: "tween", duration: 0.15, ease: "easeOut" });
    }
  };
  const motionDivClassNames = isCached ? "swipe-card-wrapper pointer-events-none" : "swipe-card-wrapper";
return (
  <motion.div className={motionDivClassNames}
    style={{
      gridRow: 1,
      gridColumn: 1,
      position: "relative",
    }}  
  >
    <motion.img
      src={url}
      alt={"Placeholder"}
      className="swipe-card"
      drag
      dragConstraints={{left: -80, right: 80, top: 0, bottom: 0}}
      dragMomentum={false}
      onDragEnd={handleDragEnd}
      style={{
        gridRow: 1,
        gridColumn: 1,
        x,
        y,
        opacity,
        rotate,
        zIndex: -1,
      }} 
    />
    <motion.img
      src={"src/assets/heartImg.png"}
      alt={"Placeholder"}
      className="swipe-like-img"
      drag
      dragConstraints={{left: -80, right: 80, top: 0, bottom: 0}}
      dragMomentum={false}
      onDragEnd={handleDragEnd}
      style={{
        gridRow: 1,
        gridColumn: 1,
        x,
        y,
        opacity: likeOpacity,
        rotate,
        position: "absolute",
        top: 0,
        right: 0,
      }} 
    />
    <motion.img
      src={"src/assets/dislikeImg.png"}
      alt={"Placeholder"}
      className="swipe-dislike-img"
      drag
      dragConstraints={{left: -80, right: 80, top: 0, bottom: 0}}
      dragMomentum={false}
      onDragEnd={handleDragEnd}
      style={{
        gridRow: 1,
        gridColumn: 1,
        x,
        y,
        opacity: dislikeOpacity,
        rotate,
        position: "absolute",
        top: 0,
        right: 0,
      }} 
    />
    <motion.img
      src={"src/assets/settingsImg.png"}
      alt={"Placeholder"}
      className="swipe-settings-img"
      drag
      dragConstraints={{left: -80, right: 80, top: 0, bottom: 0}}
      dragMomentum={false}
      onDragEnd={handleDragEnd}
      style={{
        gridRow: 1,
        gridColumn: 1,
        x,
        y,
        opacity: settingsOpacity,
        rotate,
        position: "absolute",
        top: 0,
        right: 0,
      }} 
    />
  </motion.div>
);
}

export { SwipeView, SwipeCard };

