"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"

interface MilestoneCelebrationProps {
  milestone: number
  isVisible: boolean
  onClose: () => void
}

export default function MilestoneCelebration({ milestone, isVisible, onClose }: MilestoneCelebrationProps) {
  const [image, setImage] = useState("/images/ovechkin-celebration.png")

  useEffect(() => {
    // Select appropriate image based on milestone
    if (milestone === 800) {
      setImage("/images/ovechkin-800.png")
    } else if (milestone === 700) {
      setImage("/images/ovechkin-700.png")
    } else {
      setImage("/images/ovechkin-celebration.png")
    }

    // Trigger confetti when milestone celebration is shown
    if (isVisible) {
      const duration = 5 * 1000
      const animationEnd = Date.now() + duration
      const colors = ["#e74c3c", "#ffffff", "#0a1930"]

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min
      }

      const runConfetti = () => {
        const timeLeft = animationEnd - Date.now()

        if (timeLeft <= 0) {
          return
        }

        const particleCount = 50 * (timeLeft / duration)

        // Launch confetti from both sides
        confetti({
          particleCount: Math.floor(randomInRange(particleCount / 2, particleCount)),
          angle: randomInRange(55, 125),
          spread: randomInRange(50, 70),
          origin: { x: 0 },
          colors: colors,
        })

        confetti({
          particleCount: Math.floor(randomInRange(particleCount / 2, particleCount)),
          angle: randomInRange(55, 125),
          spread: randomInRange(50, 70),
          origin: { x: 1 },
          colors: colors,
        })

        requestAnimationFrame(runConfetti)
      }

      runConfetti()
    }
  }, [milestone, isVisible])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative max-w-2xl w-full bg-[#2d2433] rounded-xl overflow-hidden"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
          >
            <div className="absolute top-4 right-4">
              <button onClick={onClose} className="bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="p-6 text-center">
              <motion.div
                className="text-4xl md:text-5xl font-bold font-squada text-[#e74c3c] mb-4 text-glow"
                initial={{ y: -20 }}
                animate={{ y: 0 }}
              >
                MILESTONE REACHED!
              </motion.div>
              <motion.div
                className="text-6xl md:text-8xl font-bold font-squada mb-6"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                {milestone} GOALS
              </motion.div>
            </div>

            <div className="relative h-80 overflow-hidden">
              <img
                src={image || "/placeholder.svg"}
                alt={`Ovechkin ${milestone} goal milestone`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2d2433] to-transparent"></div>
            </div>

            <div className="p-6 text-center">
              <p className="text-xl mb-6">
                Alexander Ovechkin continues his historic journey toward Wayne Gretzky's all-time goal record!
              </p>
              <motion.button
                className="bg-[#e74c3c] hover:bg-[#c0392b] text-white py-3 px-8 rounded-lg font-bold font-squada text-lg shine"
                onClick={onClose}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                CONTINUE
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
