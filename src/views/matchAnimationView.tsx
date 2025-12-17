import { AnimatePresence, motion } from "motion/react"
import { useState } from "react"
import "../style.css"

/* From https://motion.dev/docs/react-animation */

function MatchAnimationView() {
  const [isVisible, setIsVisible] = useState(true)

  return (
    <div className="matchContainer">
      <AnimatePresence initial={false}>
        {isVisible ? (
          <div>
            {/* VIGNETTE BACKROUND */}
            <motion.div className="match-vignette"
              key="vignette"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { type: "spring", damping: 3, stiffness: 3, restDelta: 0.001 } }}
              exit={{ opacity: 0 }}
            />

            {/* TEXT */}
            <motion.div className="match-text-wrapper"
              key="content"
              initial={{ opacity: 0, scale: 0.8 }}
              /* https://motion.dev/docs/react-transitions */
              /* Two transition types */
              animate={{
                opacity: 1,
                scale: 1,
                transition: { type: "spring", damping: 6 }
              }}
              exit={{
                opacity: 0,
                scale: 0.8,
                transition: { type: "tween" }
              }}
            >
              <div className="heart-text">{"<3"}</div>
              <div className="match-text">IT'S A MATCH!</div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      {/* Uncomment for testing the animation */}
      {/* <button
        onClick={() => setIsVisible(!isVisible)}
      >
        {isVisible ? "Hide" : "Show"}
      </button> */}
    </div>
  )
}

export { MatchAnimationView }