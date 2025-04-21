"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface NextGameProps {
  opponent: string
  date: string
  venue: string
  isHome: boolean
}

export default function NextGameCountdown({ nextGame }: { nextGame: NextGameProps }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(nextGame.date).getTime() - new Date().getTime()

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [nextGame.date])

  const timeUnits = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ]

  return (
    <div>
      <div className="mb-4">
        <div className="text-lg font-semibold">
          {nextGame.isHome ? "vs" : "@"} {nextGame.opponent}
        </div>
        <div className="text-sm text-gray-400">
          {new Date(nextGame.date).toLocaleDateString(undefined, {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
        <div className="text-sm text-gray-400">
          {new Date(nextGame.date).toLocaleTimeString(undefined, {
            hour: "2-digit",
            minute: "2-digit",
          })}{" "}
          • {nextGame.venue}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 mt-4">
        {timeUnits.map((unit, index) => (
          <motion.div
            key={unit.label}
            className="bg-[#2d2433] border border-white/10 rounded-lg p-2 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index, duration: 0.3 }}
          >
            <div className="text-xl font-bold">{unit.value}</div>
            <div className="text-xs text-gray-400">{unit.label}</div>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="mt-4 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="text-sm text-gray-300">Next chance for Ovi to score</div>
      </motion.div>
    </div>
  )
}
