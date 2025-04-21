"use client"

import { useEffect, useState, useRef } from "react"
import { motion, useAnimationControls } from "framer-motion"
import MilestoneCelebration from "./milestone-celebration"

interface GoalCounterProps {
  currentGoals: number
}

export default function GoalCounter({ currentGoals }: GoalCounterProps) {
  const [displayGoals, setDisplayGoals] = useState(0)
  const controls = useAnimationControls()
  const prevGoals = useRef(currentGoals)
  const [showCelebration, setShowCelebration] = useState(false)
  const [showIceSplash, setShowIceSplash] = useState(false)
  const [showMilestoneCelebration, setShowMilestoneCelebration] = useState(false)
  const [celebratedMilestone, setCelebratedMilestone] = useState(0)

  useEffect(() => {
    // Check if this is a milestone (divisible by 50)
    const isMilestone = currentGoals % 50 === 0 && currentGoals > 0

    // Check if goals increased (for celebration animation)
    const goalsIncreased = currentGoals > prevGoals.current

    // Animate the counter
    const startValue = displayGoals
    const duration = 2
    const frameDuration = 1000 / 60 // 60fps
    const totalFrames = Math.round(duration * 60)
    const valueIncrement = (currentGoals - startValue) / totalFrames

    let currentFrame = 0
    const counter = setInterval(() => {
      currentFrame++
      const newValue = Math.floor(startValue + valueIncrement * currentFrame)
      setDisplayGoals(newValue)

      if (currentFrame === totalFrames) {
        clearInterval(counter)

        // Trigger celebration animation if it's a milestone or goals increased
        if (isMilestone || goalsIncreased) {
          controls.start({
            scale: [1, 1.2, 1],
            color: ["#ffffff", "#e74c3c", "#ffffff"],
            transition: { duration: 0.8 },
          })

          // Show ice splash effect
          setShowIceSplash(true)
          setTimeout(() => setShowIceSplash(false), 1000)

          if (isMilestone) {
            setShowCelebration(true)
            setTimeout(() => setShowCelebration(false), 5000)

            // Show full milestone celebration for significant milestones
            if (currentGoals % 100 === 0) {
              setCelebratedMilestone(currentGoals)
              setShowMilestoneCelebration(true)
            }
          }
        }
      }
    }, frameDuration)

    prevGoals.current = currentGoals
    return () => clearInterval(counter)
  }, [currentGoals, controls, displayGoals])

  return (
    <div className="relative">
      <motion.div
        className="text-8xl md:text-9xl lg:text-[10rem] font-bold text-white hockey-font text-glow"
        animate={controls}
      >
        {displayGoals}
      </motion.div>

      {/* Ice splash effect */}
      {showIceSplash && (
        <motion.div
          className="absolute inset-0 ice-splash"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 0.8, 0], scale: [0, 1, 2] }}
          transition={{ duration: 1 }}
        />
      )}

      <div className="absolute -bottom-6 -left-4 w-full h-8 opacity-70">
        <motion.div
          className="w-full h-full bg-contain bg-no-repeat bg-left"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        />
      </div>

      {/* Celebration effects */}
      {showCelebration && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Confetti particles */}
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              initial={{
                x: 0,
                y: 0,
                opacity: 1,
                scale: 0,
                backgroundColor: i % 3 === 0 ? "#e74c3c" : i % 3 === 1 ? "#3498db" : "#ffffff",
              }}
              animate={{
                x: Math.random() * 300 - 150,
                y: Math.random() * 300 - 150,
                opacity: 0,
                scale: Math.random() * 3,
              }}
              transition={{
                duration: 2,
                delay: Math.random() * 0.5,
                ease: "easeOut",
              }}
              style={{
                top: `${50 + Math.random() * 10 - 5}%`,
                left: `${50 + Math.random() * 10 - 5}%`,
              }}
            />
          ))}

          {/* Milestone text */}
          <motion.div
            className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full"
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: -30, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="bg-[#e74c3c] text-white px-4 py-1 rounded-full text-sm font-bold whitespace-nowrap hockey-font box-glow">
              Milestone Reached!
            </div>
          </motion.div>
        </div>
      )}

      {/* Full milestone celebration modal */}
      <MilestoneCelebration
        milestone={celebratedMilestone}
        isVisible={showMilestoneCelebration}
        onClose={() => setShowMilestoneCelebration(false)}
      />
    </div>
  )
}
