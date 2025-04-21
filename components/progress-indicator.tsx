"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface ProgressIndicatorProps {
  currentGoals: number
  targetGoals: number
  percentage: number
}

export default function ProgressIndicator({ currentGoals, targetGoals, percentage }: ProgressIndicatorProps) {
  const [animatedPercentage, setAnimatedPercentage] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedPercentage(percentage)
    }, 500)

    return () => clearTimeout(timer)
  }, [percentage])

  // Calculate the circumference of the circle
  const radius = 80
  const circumference = 2 * Math.PI * radius

  // Calculate the dash offset based on the percentage
  const dashOffset = circumference - (animatedPercentage / 100) * circumference

  // Key milestones on the circular diagram
  const milestones = [
    { value: 25, label: "250" },
    { value: 50, label: "500" },
    { value: 75, label: "750" },
    { value: 100, label: "1000" },
  ]

  return (
    <div className="relative w-64 h-64 flex items-center justify-center">
      {/* Glow effect behind the circle */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-40 h-40 rounded-full bg-white/10 filter blur-xl animate-pulse"></div>
      </div>

      <svg width="100%" height="100%" viewBox="0 0 200 200" className="transform -rotate-90 relative z-10">
        {/* Background circle with gradient */}
        <defs>
          <linearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        <circle cx="100" cy="100" r={radius} fill="none" stroke="url(#circleGradient)" strokeWidth="12" />

        {/* Progress circle with gradient */}
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#f5f5f5" />
          </linearGradient>
        </defs>

        <motion.circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />

        {/* Add markers for key milestones */}
        {milestones.map((milestone) => {
          // Calculate position on the circle
          const angle = (milestone.value / 100) * 360 - 90
          const x = 100 + (radius + 20) * Math.cos((angle * Math.PI) / 180)
          const y = 100 + (radius + 20) * Math.sin((angle * Math.PI) / 180)

          // Determine if milestone is reached
          const isReached = percentage >= milestone.value

          return (
            <g key={milestone.value} className="milestone-marker">
              {/* Milestone marker */}
              <circle
                cx="100"
                cy="100"
                r="4"
                fill={isReached ? "#ffffff" : "#ffffff50"}
                transform={`rotate(${angle + 90} 100 100) translate(${radius} 0)`}
              />

              {/* Milestone label */}
              <text
                x={x}
                y={y}
                fill={isReached ? "#ffffff" : "#ffffff80"}
                fontSize="10"
                textAnchor="middle"
                dominantBaseline="middle"
                className="transform rotate-90 hockey-font"
                transform={`rotate(${90} ${x} ${y})`}
              >
                {milestone.label}
              </text>
            </g>
          )
        })}

        {/* Add decorative elements */}
        <circle cx="100" cy="100" r="65" fill="none" stroke="#ffffff10" strokeWidth="1" strokeDasharray="2 4" />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <motion.span
          className="text-4xl font-bold text-white hockey-font"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {Math.round(percentage)}%
        </motion.span>
        <motion.span
          className="text-sm text-gray-200 mt-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          to 1000 goals
        </motion.span>

        <motion.div
          className="mt-4 text-xs text-gray-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          {currentGoals} / {targetGoals}
        </motion.div>
      </div>
    </div>
  )
}
