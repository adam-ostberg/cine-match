import { AnimatePresence, motion } from "motion/react"
import { useState } from "react"
import "../style.css"
import { useEffect } from "react"

/* From https://motion.dev/docs/react-animation */

function MatchAnimationView() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => setIsVisible(false), 1200)
      return () => clearTimeout(timer)
    }
  }, [isVisible])

  return (
    <div className="matchContainer">
      <AnimatePresence>
        {isVisible ? (
        <motion.div>
          <motion.div
            className="match-vignette"
            key="vignette"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, type: "spring" }}
          >
          </motion.div>
          <motion.div
            className="match-text-wrapper"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 2 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 1.2, type: "spring" }}
          >
            <div className="heart-text">{"<3"}</div>
            <div className="match-text">IT'S A MATCH!</div>
          </motion.div>
        </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

export { MatchAnimationView }