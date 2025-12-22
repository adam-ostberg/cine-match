import "../style.css"
import type { MovieDetails } from "../apiConfig";
import { animate, motion, useMotionValue, useTransform } from "framer-motion"
import type { PromiseState } from "../resolvePromise";
import { useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useState } from "react";
import { type PanInfo } from "framer-motion";
import { FaUserCircle } from "react-icons/fa";
import ViewSidebarRoundedIcon from '@mui/icons-material/ViewSidebarRounded';
import { MatchAnimationView } from "./matchAnimationView";
import type { SessionModel, UserInfoType } from "../SessionModel";
import type { UserModel } from "../UserModel";
import { LoadingSpinner } from "../components/LoadingSpinner.tsx";
import { UserAvatar } from "../components/UserAvatar.tsx";
import { observer } from "mobx-react-lite";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import heartImg from "../assets/heartImg.png";
import dislikeImg from "../assets/dislikeImg.png";
import settingsImg from "../assets/settingsImg.png";

export type SwipeViewProps = {
  prefetchWindowPrmsState: PromiseState;
  currentSessionId: string | null;
  sessionModel: SessionModel;
  sessionShowMatchAnimation: boolean;
  userModel: UserModel;
  participants: UserInfoType[];
  isFetchingIdQueue: boolean;
  onDislike: (id: number) => void;
  onLike: (id: number) => void;
  onMoreInfo: () => void;
}

type SwipeDir = "left" | "right" | null;

const SwipeView = observer(
  function SwipeViewRender(props: SwipeViewProps) {

    const TMDB_BASE_URL = "https://image.tmdb.org/t/p/";
    const POSTER_WIDTH_URL = "w780/";

    function getDetailsQueue(details: MovieDetails[] | null) {
      if (!details) { return };
      const detailsQueue = [...details].reverse();
      return detailsQueue
    }

    const [showMatchAnimation, setShowMatchAnimation] = useState(false);
    showMatchAnimation
    const [cachedDetails, setCachedDetails] = useState<MovieDetails[] | null>(null);
    const [isFetchingIdQueue, setIsFetchingIdQueue] = useState<boolean>(false);

    useEffect(() => {
      setIsFetchingIdQueue(props.isFetchingIdQueue);
    }, [props.isFetchingIdQueue])

    // Whenever new data arrives, store it
    useEffect(() => {
      const data = props.prefetchWindowPrmsState.data as MovieDetails[] | null;
      if (data && Array.isArray(data) && data.length > 0) {
        setCachedDetails(data);
      }
      else {
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
        props.onLike(id); // SWIPES RIGHT    
      } else {
        props.onDislike(id); // SWIPES LEFT
      }
      setSwipeDirection(null);
    }
    function outputCardsCB(detail: MovieDetails, index: number, array: MovieDetails[], swipeDirection: SwipeDir) {
      if (!detail) { return };
      const is_top_card = index === array.length-1;
      return (
        <SwipeCard 
          key={detail.id} 
          id={detail.id} 
          url={TMDB_BASE_URL + POSTER_WIDTH_URL + detail.poster_path} 
          rightSwipeCB={() => handleSwipe("right", detail.id)} 
          leftSwipeCB={() => handleSwipe("left", detail.id)} 
          upSwipeCB={props.onMoreInfo} 
          swipeDirection={swipeDirection} 
          is_top_card={is_top_card}
          />
      );
    }
    function outputTitle(firstDetail: MovieDetails | undefined) {
      if (!firstDetail?.title || isFetchingIdQueue) { return "" };
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
          // temporarily removes transitions so the sidebar doesnt transition to width: 100vw when reducing screen width.
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
        <div className={`swipe-content ${props.sessionShowMatchAnimation 
          ? "input-disabled" 
          : ""}`}>
          {
            isFetchingIdQueue 
            ? <LoadingSpinner size={100}/>
            : detailsQueue?.map((detail, index, array) => outputCardsCB(detail, index, array, swipeDirection)) ?? <LoadingSpinner size={100}/>
          }
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
        {DisplayUpSwipeAnim(isFetchingIdQueue)}
        <aside className={swipeSidebarClassNames} id="swipeSidebar">
          <IconButton className="sidebar-toggle" aria-label="Toggle sidebar" onClick={() => setSidebarIsOpen(o => !o)}>
            <ViewSidebarRoundedIcon />
          </IconButton>
          <div className="sidebar-content">
            <h2>Status</h2>
            <p id="current-session">Current Session id: {props.sessionModel.sessionId}</p>
            <h2>Lobby</h2>
            <div className="sidebar-lobby-container">
              {props.participants.map(outputParticipants)}
            </div>
          </div>
        </aside>
        {props.sessionModel.showMatchAnimation && (
          <MatchAnimationView
            key={props.sessionModel.currentMatchId}
          />
        )}
      </div>
    );
  }
);

const SwipeCard = ({id, url, rightSwipeCB, leftSwipeCB, upSwipeCB, swipeDirection, is_top_card} : 
  {
    id: number, 
    url: string, 
    rightSwipeCB: CallableFunction, 
    leftSwipeCB: CallableFunction, 
    upSwipeCB: CallableFunction, 
    swipeDirection: SwipeDir, 
    is_top_card: boolean
  }) => {

  const [screenHeight, setScreenHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      setScreenHeight(window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const swipeCardHeight = screenHeight * 0.65; // from 65vh
  const swipePixelLimit = swipeCardHeight * 0.15; // change the swipe boundaries based on how high the swipe card is

  const x = useMotionValue(0);
  const y = useMotionValue(0)
  const opacity = useTransform(x, [-swipePixelLimit*1.9, 0, swipePixelLimit*1.9], [0, 1, 0]);
  const dislikeOpacity = useTransform(x, [-swipePixelLimit*1.5 ,-swipePixelLimit*0.8, 0, swipePixelLimit*0.8] , [0, 1, 0, 0]);
  const likeOpacity = useTransform(x, [-swipePixelLimit*0.8, 0, swipePixelLimit*0.8, swipePixelLimit*1.5] , [0, 0, 0.9, 0]);

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

      const yOpacity = mapRange(latestY, -40, 0, 0.9, 0);
      let xOpacity = mapRange(Math.abs(latestX), 0, 50, 0.7, 0);
      if (Math.abs(latestX) > 10) {
        xOpacity = mapRange(Math.abs(latestX), 0, 30, 0.4, 0);
      }
      return Math.min(yOpacity, xOpacity);
    }
  );
  const rotate = useTransform(x, [swipePixelLimit*1.7, -swipePixelLimit*1.7], [-18, 18]);

  useEffect(() => {
    if (!swipeDirection || !is_top_card) return;
    const targetX = swipeDirection === "right" ? swipePixelLimit*2 : -swipePixelLimit*2;

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

    if (info.offset.x > swipePixelLimit) {
      animate(x, swipePixelLimit*2, {
        type: "tween",
        duration: 0.1,
        ease: "easeOut",
        onComplete: () => rightSwipeCB(),
      });
    } else if (info.offset.x < -swipePixelLimit) {
      animate(x, -swipePixelLimit*2, {
        type: "tween",
        duration: 0.1,
        ease: "easeOut",
        onComplete: () => leftSwipeCB(),
      });
    } else if (info.offset.y < -swipePixelLimit && Math.abs(info.offset.x) < swipePixelLimit) {
      // you might want a vertical animation here too
      upSwipeCB();
      animate(y, 0, { type: "tween", duration: 0.15, ease: "easeOut" });
      animate(x, 0, { type: "tween", duration: 0.15, ease: "easeOut" });
    } else {
      animate(x, 0, { type: "tween", duration: 0.15, ease: "easeOut" });
    }
  };
return (
  <motion.div className="swipe-card-wrapper"
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
      dragConstraints={{left: -swipePixelLimit, right: swipePixelLimit, top: 0, bottom: 0}}
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
      src={heartImg}
      alt={"Placeholder"}
      className="swipe-like-img"
      drag
      dragConstraints={{left: -swipePixelLimit, right: swipePixelLimit, top: 0, bottom: 0}}
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
      src={dislikeImg}
      alt={"Placeholder"}
      className="swipe-dislike-img"
      drag
      dragConstraints={{left: -swipePixelLimit, right: swipePixelLimit, top: 0, bottom: 0}}
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
      src={settingsImg}
      alt={"Placeholder"}
      className="swipe-settings-img"
      drag
      dragConstraints={{left: -swipePixelLimit, right: swipePixelLimit, top: 0, bottom: 0}}
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

function DisplayUpSwipeAnim(isFetchingIdQueue: boolean) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const DURATION_MS = 4220; // match animation length
    const t = setTimeout(() => setVisible(false), DURATION_MS);
    return () => clearTimeout(t);
  }, []);

  if (!isFetchingIdQueue) return null;
  if (!visible) return null;
  return (
  <div
    style={{
      position: "fixed",
      width: "80vim",
      height: "80vmin",
      aspectRatio: "1 / 1",
      top: "60%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      pointerEvents: "none",
    }}>
    <DotLottieReact
      src="/SwipeUpAnim.lottie"
      autoplay
      loop
      loopCount={2}
      style={{
        width: "100%",
        height: "100%",
        zIndex: 2,
      }}
    />
  </div>
  );
}

export { SwipeView, SwipeCard };

